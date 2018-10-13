const electron = require('electron');
const { ipcRenderer } = electron;
const serverList = document.getElementById("serverList");

(function()
{
    ipcRenderer.send("getserver")
})();

ipcRenderer.on("serverinfo", function(e, item)
{
    var tkn = item.split("\\");

    var column = document.createElement("div");
    column.className = "w3-col s4";
    column.id = "sr_resize";
    column.style.backgroundColor = "#36393e";
    column.style.paddingLeft = "50px";

    var card = document.createElement("div");
    card.className = "card";
    card.style.width = "24rem";

    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    var cardText = document.createElement("p");
    cardText.style.whiteSpace = "pre-line";
    cardText.style.color = "white";

    for(var i = 0; i<tkn.length; i++)
    {
        var string = tkn[i].split("@");
        if(string.length > 1)
        {
            if(string[0] == "hostname")
            {
                hostname = string[1].split(" ");

                var h2 = document.createElement("h2");
                h2.appendChild(document.createTextNode(hostname[0] + " " + hostname[1]));
                h2.style.fontFamily = "BankGothic";
                h2.style.textAlign = "center";
                cardBody.appendChild(h2);
            }

            if(string[0] == "address")
            {
                var button = document.createElement("a");
                button.href = "cod4://" + string[1];
                button.className = "btn btn-primary";
                button.innerHTML = "Connect";
                cardBody.appendChild(button);
            }

            if(string[0] == "mapname")
            {
                var cardTitle = document.createElement("h5");
                cardTitle.appendChild(document.createTextNode(string[1].toUpperCase()));
                cardTitle.className = "card-title";
                cardBody.appendChild(cardTitle);

                var img = document.createElement("img");
                img.className = "card-img-top";
                img.src = "http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + string[1] + ".jpg";
                img.alt = "Card image cap";
                cardBody.appendChild(img);

                if(!FileTest("http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + string[1] + ".jpg")) {
                    img.src = "images/loadscreen_not_found.jpg";
                }
            }
            
            if(string[0] == "player")
            {
                cardText.appendChild(document.createTextNode(string[1] + "\n"));
            }

        }
    }

    serverList.appendChild(column);

    column.appendChild(card);
    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(cardBody);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(button);
});

function toTitle(str)
{
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

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