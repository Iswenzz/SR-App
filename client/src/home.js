const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

$(document).ready(function () 
{
    check_update();
});

/**
 * Check for updates.
 */
async function check_update()
{
    let client_ver = "1.2";
    let rawFile = new XMLHttpRequest();

    rawFile.open("GET", "https://iswenzz.com:1337/speedrun_app/version.txt", true);
    rawFile.onreadystatechange = () =>
    {
        let serv_ver = undefined;
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status == 0)
                serv_ver = rawFile.responseText;
        }

        if (serv_ver !== undefined)
        {
            if (parseFloat(client_ver) < parseFloat(serv_ver))
                $("#update-button").toggle(500);
        }
    }
    rawFile.send(null);
}
