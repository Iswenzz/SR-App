const electron = require('electron');
const { ipcRenderer } = electron;
const searchBox = document.getElementById('searchform')
const ul = document.getElementById('serchList');
const background = document.getElementById("searchbackground");

(function () 
{
    var hash = document.URL.substring(document.URL.indexOf("#") + 1);

    if (hash.length != 0) 
    {
        ipcRenderer.send('getplayer', hash);
    }
})();

ipcRenderer.on('search:playerid', function (e, item) 
{
    const li = document.createElement('li');
    var a = document.createElement('a');
    const itemText = document.createTextNode(item);
    a.appendChild(itemText);
    a.href = "#";
    a.id = "searchLink";
    li.appendChild(a);
    ul.appendChild(li);
});

ipcRenderer.on("playertimes", function(e, item)
{
    var tkn = item.split("\\")

    if(tkn.length < 7)
        return;
    
    var table = document.getElementById("playertimes")

    if (table.innerHTML == "")
    {
        var header = document.createElement("tr");
        var headerMap = document.createElement("th")
        var headerTime = document.createElement("th");
        var headerSpeed = document.createElement("th");
        var headerWay = document.createElement("th");

        header.appendChild(headerMap);
        header.appendChild(headerTime);
        header.appendChild(headerSpeed);
        header.appendChild(headerWay);
    }

    var row = document.createElement('tr');
    var rowText;
    var rowName = document.createElement('td');
    rowName.className = "";

    var maptkn = tkn[0].split("_");
    var mapName = "";

    for(var i = 0; i<maptkn.length-2; i++)
    {
        if(i != maptkn.length-3)
            mapName += maptkn[i] + "_";
        else
            mapName += maptkn[i];
    }

    rowText = document.createTextNode(mapName);
    rowName.appendChild(rowText);

    var rowTime = document.createElement('td');
    rowTime.className = "";
    rowText = document.createTextNode(getRealTime(tkn[3]));
    rowTime.appendChild(rowText);

    var rowSpeed = document.createElement('td');
    rowSpeed.className = "";
    rowText = document.createTextNode(tkn[1]);
    rowSpeed.appendChild(rowText);

    var rowWay = document.createElement('td');
    rowWay.className = "";

    rowText = tkn[2] == "0" ? document.createTextNode("Normal") : document.createTextNode("Secret");
    rowWay.appendChild(rowText);

    row.appendChild(rowName);
    row.appendChild(rowTime);
    row.appendChild(rowSpeed);
    row.appendChild(rowWay);

    table.appendChild(row);
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

ul.addEventListener('click', function(e)
{
    if(e.target.id == "searchLink")
    {
        ipcRenderer.send('getplayer', e.target.innerHTML);
        ul.innerHTML = "";
        background.style.display = "none";
        document.querySelector("#searchText").value = "";
        document.getElementById("playertimes").innerHTML = "";
    }
});

searchBox.onkeyup = function (e) 
{
    var item = document.querySelector('#searchText').value;

    if (item != "" && item.length < 10 && item.length >= 3)
    {
        ipcRenderer.send('search:playerid', item);
        background.style.display = "block";
    }

    if (item == "") 
    {
        ul.innerHTML = '';
        background.style.display = "none";
    }
}

ipcRenderer.on('search:clear', function () 
{
    ul.innerHTML = '';
});