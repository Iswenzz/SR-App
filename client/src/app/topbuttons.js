const { BrowserWindow } = require('electron').remote;

particlesJS.load('particles-js', 'json/particles.json');

$(document).on("click", "#min-btn", () => 
{
    let window = BrowserWindow.getFocusedWindow();
    window.minimize();
});

$(document).on("click", "#max-btn", () => 
{
    let window = BrowserWindow.getFocusedWindow();

    if (window.isMaximized())
        window.unmaximize();
    else
        window.maximize();
});

$(document).on("click", "#close-btn", () => 
{
    let window = BrowserWindow.getFocusedWindow();
    window.close();
});
