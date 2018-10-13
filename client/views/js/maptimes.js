const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.getElementById('serchList');
const link = document.getElementById('searchLink');
const searchBox = document.getElementById('searchform')
const background = document.getElementById("searchbackground");

ipcRenderer.on('search:results', function(e, item)
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

ipcRenderer.on('maptimes', function(e,item)
{
    var tkn = item.split("\\");

    if(tkn.length < 5)
        return;
      
    var names = document.getElementById("name" + tkn[0] + tkn[1]);

    if(names.innerHTML == "")
    {
        var header = document.createElement('tr');
        var headerName = document.createElement('th');
        var headerTime = document.createElement('th');
        var headerId = document.createElement('th');

        header.appendChild(headerName);
        header.appendChild(headerTime);
        header.appendChild(headerId);
    }

    var table = document.createElement('tr');

    var tableRank = document.createElement('td');
    tableRank.className = "tableRank";

    var tableText = document.createTextNode((document.getElementById("name"+tkn[0]+tkn[1]).getElementsByTagName("tr").length + 1));
    tableRank.appendChild(tableText);

    var tableName = document.createElement('td');
    tableName.className = "tableName";
    var tableText = document.createTextNode(tkn[3]);
    tableName.appendChild(tableText);

    var tableTime = document.createElement('td');
    tableTime.className = "tableTime";
    tableText = document.createTextNode(getRealTime(tkn[2]));
    tableTime.appendChild(tableText);

    var tableId = document.createElement('td');
    var tableIdLink = document.createElement('a');
    tableText = document.createTextNode(tkn[4]);
    tableIdLink.appendChild(tableText);
    tableIdLink.href = "players.html#" + tkn[4];
    tableIdLink.id = "playerlink";
    tableId.appendChild(tableIdLink);

    table.appendChild(tableRank);
    table.appendChild(tableName);
    table.appendChild(tableTime);
    table.appendChild(tableId);

    names.appendChild(table);
});

ipcRenderer.on('times:clear', function ()
{
    var ids = ["name1900", "name1901", "name2100", "name2101"]

    for(i = 0; i<ids.length; i++)
    {
        document.getElementById(ids[i]).innerHTML = "";
    }
});

function getRealTime(time)
{
    var original = time;
    var miliseconds = time;
    var minutes = parseInt(time/60000);
    miliseconds = parseInt(miliseconds%60000);
    var seconds = parseInt(miliseconds/1000);
    miliseconds = parseInt(miliseconds%1000);
    return minutes + ":" + seconds + ":" + miliseconds;
}

ipcRenderer.on('search:clear', function() 
{
    ul.innerHTML = '';
});

searchBox.onkeyup = function(e)
{
    var item = document.querySelector('#searchText').value;

    if(item != "" && item.length < 30)
    {
        ipcRenderer.send('search:mapTimes', item);
        background.style.display = "block";
    }

    if(item == "")
    {
        ul.innerHTML = '';
        background.style.display = "none";
    }
}

ul.addEventListener('click', function(e)
{
    if(e.target.id == "searchLink")
    {
        ipcRenderer.send('getmap', e.target.innerHTML);
        ul.innerHTML = '';
        background.style.display = "none";
        document.querySelector('#searchText').value = "";

        document.getElementById("mapname1").innerHTML = "";
        document.getElementById("mapname2").innerHTML = "";
        document.getElementById("mapname3").innerHTML = "";
        document.getElementById("mapname4").innerHTML = "";

        document.getElementById("mapimage1").src = "http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + e.target.innerHTML + ".jpg";
        document.getElementById("mapimage2").src = "http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + e.target.innerHTML + ".jpg";
        document.getElementById("mapimage3").src = "http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + e.target.innerHTML + ".jpg";
        document.getElementById("mapimage4").src = "http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + e.target.innerHTML + ".jpg";

        document.getElementById("infodisplay_anim").style = "display: block;"
        document.getElementById("sr_prev").style = "display: block;"
        document.getElementById("sr_next").style = "display: block;"

        document.getElementById("mapname1").appendChild(document.createTextNode(e.target.innerHTML));
        document.getElementById("mapname2").appendChild(document.createTextNode(e.target.innerHTML));
        document.getElementById("mapname3").appendChild(document.createTextNode(e.target.innerHTML));
        document.getElementById("mapname4").appendChild(document.createTextNode(e.target.innerHTML));

        if(!FileTest("http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + e.target.innerHTML + ".jpg")) 
        {
            document.getElementById("mapimage1").src = "images/loadscreen_not_found.jpg";
            document.getElementById("mapimage2").src = "images/loadscreen_not_found.jpg";
            document.getElementById("mapimage3").src = "images/loadscreen_not_found.jpg";
            document.getElementById("mapimage4").src = "images/loadscreen_not_found.jpg";
        }
    }
});

function FileTest(url) 
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
     
    if (xhr.status == "404") 
    {
        return false;
    } 

    else 
    {
        return true;
    }
}