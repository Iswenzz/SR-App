const electron = require('electron');
const {ipcRenderer} = electron;

const ul = $("#serchList");
const link = $("#searchLink");
const searchBox = $("#searchform");
const background = $("#searchbackground");

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

$(searchBox).on("keyup", (e) => 
{
	var item = $("#searchText").val();

	if (item == "") 
	{
		$(ul).html("");
		$(background).css("display", "block");
		console.log("empty text box");
	}
	else if (item.length < 30)
	{
		ipcRenderer.send('search:mapTimes', item);
		$(background).css("display", "block");
	}
});

ipcRenderer.on('maptimes', (e,item) =>
{
    let tkn = item.split("\\");

    if (tkn.length < 5)
        return;
      
    let table = $(".playerTimesTable");
    let tr = $('<tr></tr>');

    let tableRank = $('<td></td>')
        .addClass("tableRank")
        .text($(".playerTimesTable tr").length + 1);

    let tableName = $('<td></td>')
        .addClass("tableName")
        .text(tkn[3]);

    let tableTime = $('<td></td>')
        .addClass("tableTime")
        .text(getRealTime(tkn[2]));

	let tableIdLink = $('<a></a>')
		.attr("href", "players.html#")
		.attr("id", "playerlink")
		.text(tkn[4]);
    
	let tableId = $('<td></td>').append(tableIdLink);

	$(tr).append(tableRank);
	$(tr).append(tableName);
	$(tr).append(tableTime);
	$(tr).append(tableId);

	$(table).append(tr);
});

ipcRenderer.on('times:clear', () =>
{
	
});

function getRealTime(time)
{
    var original = time;
    var miliseconds = time;
    var minutes = parseInt(time / 60000);
    miliseconds = parseInt(miliseconds % 60000);
    var seconds = parseInt(miliseconds / 1000);
    miliseconds = parseInt(miliseconds % 1000);
    return minutes + ":" + seconds + ":" + miliseconds;
}

ipcRenderer.on('search:clear', () =>
{
    $(ul).html("");
});

$(ul).on('click', (e) =>
{
    if ($(e.target).attr("id") == "searchLink") 
    {
        let mapName = $(e.target).text();

        console.log(mapName);
        ipcRenderer.send('getmap', mapName);

        $(ul).html("");
        $(background).css("display", "none");
        $("#searchText").val("");

        $(background).css("#infodisplay_anim", "none");
        $(background).css("#sr_prev", "none");
        $(background).css("#sr_next", "none");
    }
});

function FileTest(url) 
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
     
    if (xhr.status == "404") 
        return false;
    else 
        return true;
}
