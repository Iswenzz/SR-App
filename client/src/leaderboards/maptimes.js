const electron = require('electron');
const {ipcRenderer} = electron;

const ul = $("#serchList");
const searchBox = $("#searchform");
const background = $("#searchbackground");

let ways = [];

/**
 * Gets all map results from the searchbox.
 */
ipcRenderer.on('search:results', (e, item) =>
{
	let li = $("<li></li>");
	let a = $("<a></a>")
		.text(item)
		.attr("href", "#")
		.attr("id", "searchLink");
	$(li).append(a);
	$(ul).append(li);
});

/**
 * Searchbox keyup event.
 */
$(searchBox).on("keyup", (e) => 
{
	let item = $("#searchText").val();

	if (item == "") 
	{
		$(ul).html("");
		$(background).css("display", "none");
	}
	else if (item.length < 30)
	{
		ipcRenderer.send('search:mapTimes', item);
		$(background).css("display", "block");
	}
});

/**
 * Render each entry to the leaderboard.
 */
ipcRenderer.on('maptimes', (e, item) =>
{
    let tkn = item.split("\\");
    if (tkn.length < 5) return;
		
	// add button to switch way
	if (!ways.includes(tkn[1]))
	{
		ways.push(tkn[1]);

		let id = "0";
		let isSecret = true;

		if (tkn[1].includes("ns"))
		{
			id = tkn[1].split("ns")[1];
			isSecret = false;
		}
		else if (tkn[1].includes("s"))
			id = tkn[1].split("s")[1];

		let outline = isSecret ? "btn-outline-secondary" : "btn-outline-danger";
		let shortWay = isSecret ? "S" : "N";

		$("#srwaycontainer" + id).append(`
			<button style="font-family: Bankgothic" id="srwaybutton" way="${tkn[1]}" 
			class="btn ${outline} btn-circle btn-circle-lg m-1">${shortWay}</button>`);
	}
	  
	if ($(".playerTimesTable").attr("speed") == tkn[0]
		&& $(".playerTimesTable").attr("way") == tkn[1])
	{
		$("#mapWay").text(tkn[0] + " " + tkn[1]);

		let itemCount = $(".playerTimesTable tr").length;
		let table = $(".playerTimesTable");
		let tr = $('<tr></tr>');

		let tableRank = $('<td></td>')
			.addClass("tableRank");
		switch (itemCount)
		{
			case 0: 
			case 1: 
			case 2: 
				$(tableRank).append($("<img></img>")
					.attr("src", "assets/images/" + itemCount + ".png")
					.attr("width", "30")
					.attr("height", "30")
					.addClass("img-fluid"));
				break;
			default: 
				$(tableRank).text(itemCount + 1); 
				break;
		}

		let tableName = $('<td></td>')
			.addClass("tableName")
			.text(tkn[3]);
		switch (itemCount)
		{
			case 0: $(tableName).css("color", "gold"); 	 			break;
			case 1: $(tableName).css("color", "lightsteelblue"); 	break;
			case 2: $(tableName).css("color", "peru"); 				break;
		}

		let tableTime = $('<td></td>')
			.addClass("tableTime")
			.text(getRealTime(tkn[2]));	
		switch (itemCount) 
		{
			case 0: $(tableTime).css("color", "gold"); 				break;
			case 1: $(tableTime).css("color", "lightsteelblue"); 	break;
			case 2: $(tableTime).css("color", "peru"); 				break;
		}

		let tableIdLink = $('<a></a>')
			.attr("href", "players.html#" + tkn[4])
			.attr("id", "playerlink")
			.text(tkn[4]);

		let tableId = $('<td></td>').append(tableIdLink);

		$(tr).append(tableRank);
		$(tr).append(tableName);
		$(tr).append(tableTime);
		$(tr).append(tableId);

		$(table).append(tr);
	}
});

/**
 * Way button callback.
 */
$(document).on("click", "#srwaybutton", function () 
{
	$(".playerTimesTable").fadeToggle(200, () => 
	{
		$(".playerTimesTable").attr("way", $(this).attr("way"));
		ipcRenderer.send('getmap', $("#mapName").text());
		$(".playerTimesTable").fadeToggle(200);
	});
});

/**
 * Speed button callback.
 */
$(document).on("click", "#srspeedbutton", function ()
{
	$(".playerTimesTable").fadeToggle(200, () => 
	{
		$(".playerTimesTable").attr("speed", $(this).attr("speed"));
		ipcRenderer.send('getmap', $("#mapName").text());
		$(".playerTimesTable").fadeToggle(200);
	});
});

/**
 * Clear leaderboards.
 */
ipcRenderer.on('times:clear', () =>
{
	$(".playerTimesTable").html("");
	$("#mapImage").html("");
});

/**
 * Clear the searchbox.
 */
ipcRenderer.on('search:clear', () =>
{
    $(ul).html("");
});

/**
 * Load map infos.
 */
$(ul).on('click', (e) =>
{
    if ($(e.target).attr("id") == "searchLink") 
    {
		let mapName = $(e.target).text();
		let mapImage = "assets/images/loadscreen_not_found.jpg";
		if (FileTest("https://iswenzz.com:1337/speedrun_app/views/images/loadscreen/loadscreen_" + mapName + ".jpg"))
			mapImage = "https://iswenzz.com:1337/speedrun_app/views/images/loadscreen/loadscreen_" + mapName + ".jpg";

		// clear buttons element/array
		ways = [];
		for (let i = 0; i < 6; i++)
			$("#srwaycontainer" + i).html("");

		// set to 190 ns0 by default
		$(".playerTimesTable")
			.attr("speed", "190")
			.attr("way", "ns0");

        ipcRenderer.send('getmap', mapName);

        $(ul).html("");
		$(background).css("display", "none");
		$("#buttonContainer").css("display", "block");
		$("#searchText").val("");
		$("#mapName").text(mapName);
		$("#mapImage").attr("src", mapImage);
    }
});

function getRealTime(time) 
{
	let miliseconds = time;
	const minutes = parseInt(time / 60000);
	miliseconds = parseInt(miliseconds % 60000);
	const seconds = parseInt(miliseconds / 1000);
	miliseconds = parseInt(miliseconds % 1000);
	return minutes + ":" + seconds + ":" + miliseconds;
}

function FileTest(url) 
{
    let xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
     
    if (xhr.status == "404") 
        return false;
    else 
        return true;
}
