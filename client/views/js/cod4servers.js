const electron = require('electron');
const { ipcRenderer } = electron;

const serverList = $("#serverList");
ipcRenderer.send("getserver");

ipcRenderer.on("serverinfo", (e, item) =>
{
    // 0 = game, 1 = ip:port, 2 = serv name, 3 = map/info, 4... = array players
    let tkn = item.split("\\");
    
    let players = tkn.slice(4, -1);
    let playerStr = "No players online.";
    if (players.length > 0)
    {
        playerStr = "";
        players.forEach((player) => 
        {
            playerStr += player + "\n";
        });
    }
    
    switch (tkn[0])
    {
        case 'cod4':
            tkn[1] = "cod4://" + tkn[1];
            tkn[2] = tkn[2].replace("#Deathrun #CODJumper #Quake3", "");
            break;
        case 'minecraft':
            tkn[1] = "#";
            break;
    }

    const card = $(
    "<div class=\"card shadow-lg m-3\" style=\"background: transparent\">"
        + "<div class=\"card-title\" style=\"background: rgba(0, 0, 0, 0.2)\">"
            + "<h5 class=\"card-title text-center\" style=\"font-family: Bankgothic\">" + tkn[2] + "</h5>"
            + "<p class=\"card-title text-center\" style=\"font-family: Bankgothic; background: rgba(0, 0, 0, 0.2)\">" + tkn[3] + "</p>"
        + "</div>"
        + "<div class=\"card-body\" style=\"background: transparent\">"
            + "<p class=\"card-text\" style=\"white-space: pre-line\">" + playerStr + "</p>"
        + "</div>"
        + "<div class=\"text-right\">"
            + "<a class=\"btn btn-outline-danger btn-circle btn-circle-p m-2\" href=\"" + tkn[1] + "\">"
                + "<i class=\"fas fa-gamepad\"></i>"
            + "</a>"
        + "</div>"
    + "</div>");
    $(serverList).append(card);
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
