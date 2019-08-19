const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

// -----------------------------------------------------
// --------------------- MESSAGES ----------------------
// -----------------------------------------------------

wss.on('connection', (ws) =>
{
    console.log("Connected");

    ws.on('message', (message) =>
    {
        console.log('received: %s', message);

        if (message.startsWith("mapsearch"))
        {
            var arr = filterResults(getMaps(message));
            ws.send(JSON.stringify(arr));
        }

        if (message.startsWith("maptime"))
        {
            getMapTimes(message, (arr) =>
            {
                ws.send(JSON.stringify(arr));
            });
        }

        if (message.startsWith("playersearch"))
        {
            getIds(message, (arr) =>
            {
                ws.send(JSON.stringify(arr));
            });
        }

        if (message.startsWith("playertimes"))
        {
            getPlayerTimes(message, (arr) =>
            {
                ws.send(JSON.stringify(arr));
            });
        }
    });  
});

// -----------------------------------------------------
// --------------------- RESPONSE ----------------------
// -----------------------------------------------------

function getPlayerTimes(message, done)
{
    var tkn = message.toLowerCase().split(":")
    var path = __dirname + "/../personbest";
    var times = ["playertimes"];

    if (tkn.length > 1)
    {
        var files = fs.readdirSync(path);
        for (var i = 0; i<files.length; i++)
        {
            if (files[i] == tkn[1]+".txt")
            {
                fs.readFile(path + "/" + files[i], { encoding: 'utf-8' }, function (err, data) 
                {
                    if (!err)
                    {
                        var text = data;
                        var lines = text.split("\n");
                        
                        for (x = 0; x < lines.length; x++)
                            times[times.length] = lines[x];
                    }
                    else
                        console.log(err);

                    done(times);
                });
            }
        }
    }
}

function getIds(message, done)
{
    var tkn = message.toLowerCase().split(":");
    var results = ["idsearch"];

    if (tkn.length > 1)
    {
        var files = fs.readdirSync(__dirname + "/../personbest");
        for (var i = 0; i < files.length; i++)
        {
            var file = files[i].split(".")[0];

            if (file.startsWith(tkn[1]))
            {
                results[results.length] = file;
            }
        }
    }
    done(results);
}

function getMapTimes(message, done)
{
    var tkn = message.toLowerCase().split(":");
    var path = __dirname + "/../map_times";
    var maps = [];

    if (tkn.length > 1) 
    {
        var files = fs.readdirSync(path);

        for(var i = 0; i<files.length; i++)
        {
            if (files[i].startsWith(tkn[1] + "_fastesttimes_"))
            {
                maps[maps.length] = files[i];
            }
        }
    }

    readTimes(maps, function (times)
    {
        done(times);
    });

    function readTimes(f, done)
    {
        var count = f.length;
        var times = ["mapresults"];

        for(var i = 0; i<f.length; i++)
        {
            fs.readFile(path + "/" + f[i], { encoding: 'utf-8' }, function (err, data)
            {
                if (!err) 
                {
                    var text = data;
                    var lines = text.split("\n");

                    for(x = 0; x<lines.length; x++)
                    {
                        times[times.length] = lines[x];
                    }

                    count--;

                    if(count == 0)
                        done(times);
                }

                else 
                {
                    console.log(err);
                }
            });
        }
    }
}

function getMaps(message)
{  
    var tkn = message.toLowerCase().split(":");
    var results = ["mapsearch"];

    if (tkn[0] == "mapsearch")
    {
        if (tkn.length > 1)
        {
            var files = fs.readdirSync(__dirname + "/../map_times");

            for (var i = 0; i<files.length; i++)
            {
                var file = files[i].split(".")[0];

                if (file.startsWith(tkn[1]))
                    results[results.length] = file;

                else if (file.includes(tkn[1]))
                    results[results.length] = file;
            }
        }
    }
    return results;
}

function filterResults(arr)
{
    var maps = [];

    cont: for (var z = 0; z<arr.length; z++)
    {
        var tkn = arr[z].split("_");
        var mapName = "";

        for (i = 0; i<tkn.length; i++)
        {
            if (tkn[i] != "fastesttimes")
            {
                if(i == 0)
                    mapName += tkn[i] + "_";
                else if(i == 1)
                    mapName += tkn[i];
                else if(i > 1)
                    mapName += "_" + tkn[i];
            }    
            else
                break;
        }

        for(l = 0; l < maps.length; l++)
        {
            if(maps[l] == mapName)
                continue cont;
        }
        maps[maps.length] = mapName;
    }
    return maps;
}