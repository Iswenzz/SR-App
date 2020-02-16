const electron = require('electron');
const { ipcRenderer } = electron;

const searchBox = $('#searchform')
const ul = $('#serchList');
const background = $("#searchbackground");

let hash = document.URL.substring(document.URL.indexOf("#") + 1);

if (hash.length != 0)
    ipcRenderer.send('getplayer', hash);

/**
 * Get all map results from the searchbox.
 */
ipcRenderer.on('search:playerid', (e, item) =>
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
 * Render PB from a player profile.
 */
ipcRenderer.on("playertimes", (e, item) =>
{
    let tkn = item.split("\\")
    if (tkn.length < 7) return;
    
    let table = $("#playertimes");
    let row = $('<tr></tr>');

    let rowName = $('<td></td>');
    let maptkn = tkn[0].split("_");
    let mapName = "";
    for (let i = 0; i < maptkn.length-2; i++)
    {
        if (i != maptkn.length-3)
            mapName += maptkn[i] + "_";
        else
            mapName += maptkn[i];
    }
    $(rowName).text(mapName);

    let rowTime = $('<td></td>');
    $(rowTime).text(getRealTime(tkn[3]));

    let rowSpeed = $('<td></td>');
    $(rowSpeed).text(tkn[1]);

    let id = "0";
    let isSecret = true;
    if (tkn[2].includes("ns")) 
    {
        id = tkn[2].split("ns")[1];
        isSecret = false;
    }
    else if (tkn[2].includes("s"))
        id = tkn[2].split("s")[1];
    let rowWay = $('<td></td>');
    $(rowWay).text(isSecret ? "Secret " + id : "Normal " + id)
        .css("color", isSecret ? "steelblue" : "lightgreen");

    $(row).append(rowName);
    $(row).append(rowTime);
    $(row).append(rowSpeed);
    $(row).append(rowWay);

    $(table).append(row);
});

/**
 * Load player profile.
 */
$(ul).on("click", (e) =>
{
    if ($(e.target).attr("id") == "searchLink")
    {
        ipcRenderer.send('getplayer', e.target.innerHTML);
        $(ul).html("");
        $(background).css("display", "none");
        $("#searchText").val("");
        $("#playertimes").html("");
    }
});

/**
 * Searchbox keyup event.
 */
$(searchBox).on("keyup", (e) =>
{
    let item = document.querySelector('#searchText').value;

    if (item == "") 
    {
        $(ul).html("");
        $(background).css("display", "none");
    }
    else if (item.length < 10 && item.length >= 3)
    {
        ipcRenderer.send('search:playerid', item);
        $(background).css("display", "block");
    }
});

/**
 * Clear searchbox results.
 */
ipcRenderer.on('search:clear', () =>
{
    $(ul).html("");
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
