const electron = require('electron');
const url = require('url');
const path = require('path');
const WebSocket = require('ws');

var ws;
const { app, BrowserWindow, Menu, ipcMain, webContents} = electron;
let mainWindow;
let addWindow;
// process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'debug';

// ----------------------------------------------------
// --------------------- UPDATES ----------------------
// ----------------------------------------------------

function check_update()
{
    var client_ver = "1.0";
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var rawFile = new XMLHttpRequest();

    rawFile.open("GET", "http://213.32.18.205:1337/speedrun_app/version.txt", true);
    rawFile.onreadystatechange = () =>
    {
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status == 0)
                var serv_ver = rawFile.responseText;
        }

        if (parseFloat(client_ver) < parseFloat(serv_ver))
        {
            console.log('update');

            var exec = require('child_process').exec;
            exec('updater.exe', (error, stdout, stderr) => {});
        }
    }
    rawFile.send(null);
}
check_update();

// --------------------------------------------------
// --------------------- CLIENT ---------------------
// --------------------------------------------------

var connect = () =>
{
    ws = new WebSocket('ws://127.0.0.1:8080');

    ws.on('open', () =>
    {
        console.log('socket open');
    });

    ws.on('error', (e) =>
    {
        console.log(e);
    });

    ws.on('close', () =>
    {
        console.log('socket close');
        setTimeout(connect, 3000);
    });

    ws.on('message', (data) =>
    {
        if (data == "close")
            app.quit();

        mainWindow.webContents.send('search:clear');

        var index = 0;
        var mode = "";

        JSON.parse(data, (key, value) => 
        {
            if (index == 0) 
                mode = value;

            if (index != 0) 
            {
                switch (mode)
                {
                    case "mapsearch_": 
                        mainWindow.webContents.send('search:results', value);
                        break;
                    case "mapresults": 
                        mainWindow.webContents.send("maptimes", value);
                        break;
                    case "idsearch": 
                        mainWindow.webContents.send("search:playerid", value);
                        break;
                    case "playertimes": 
                        mainWindow.webContents.send("playertimes", value);
                        break;
                    case "serverinfo": 
                        mainWindow.webContents.send("serverinfo", value);
                        break;
                }
            }
            index++;
        });
    });
};
connect();

eval = global.eval = () =>
{
    throw new Error(`Sorry, this app does not support window.eval().`);
}

app.on('ready', () =>
{
    mainWindow = new BrowserWindow(
    {
        backgroundColor: '#36393e',
        'width': 1250,
        'height': 800,
        'minHeight': 750,
        'minWidth': 600,
        frame: false,
    });
    
    mainWindow.loadURL(url.format(
    {
        pathname: path.join(__dirname, 'views/home.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () =>
    {
        app.quit();
    });

    mainWindow.webContents.openDevTools();
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('search:playerid', (e, item) =>
{
    if (ws.readyState == 1)
        ws.send("playersearch:"+item);
});

ipcMain.on("getplayer", (e, item) =>
{
    
    mainWindow.webContents.send('times:clear');
    if (ws.readyState == 1)
        ws.send("playertimes:"+item);
});

ipcMain.on('search:mapTimes', (e, item) =>
{  
    if(ws.readyState == 1)
        ws.send("mapsearch:"+item);
});

ipcMain.on('getmap', (e, item) =>
{
    mainWindow.webContents.send('times:clear');
    if (ws.readyState == 1)
        ws.send("maptime:" + item);
});

ipcMain.on('getserver', (e, item) =>
{
    if (ws.readyState == 1)
        ws.send("servers:null");
});

// ----------------------------------------------------
// --------------------- DEV TOOL ---------------------
// ----------------------------------------------------

function createAddWindow()
{
    addWindow = new BrowserWindow(
    {
        width: 300,
        height: 200,
        title:'Add map'
    });

    addWindow.loadURL(url.format(
    {
        pathname: path.join(__dirname, ''),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', () =>
    {
        addWindow = null;
    })
}

const mainMenuTemplate = [{
    label:'File',
    submenu: 
    [{
        label:'Add Item',
        click(){
            createAddWindow();
        }
    },
    {
        label:'Clear Items'
    },
    {
        label:'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        
        click(){
            app.quit();
        }
    }]
}];

if(process.platform == 'darwin')
    mainMenuTemplate.unshift({ });

if(process.env.NODE_ENV != 'production')
{
    mainMenuTemplate.push(
    {
        label: 'Developer Tools',
        submenu:
        [{
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }]
    })
}
