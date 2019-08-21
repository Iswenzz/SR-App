const electron = require('electron');
const { ipcRenderer } = electron;

const serverList = $("#serverList");

ipcRenderer.send("getserver");

ipcRenderer.on("serverinfo", (e, item) =>
{
    console.log(item);
    
});

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
