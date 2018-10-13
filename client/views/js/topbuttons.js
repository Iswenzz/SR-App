(function () 
{
    const { BrowserWindow } = require('electron').remote

    function init() 
    {
        console.log("hello");

        document.getElementById("min-btn").addEventListener("click", (e) => 
        {
            console.log("test");
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", (e) => 
        {
            var window = BrowserWindow.getFocusedWindow();

            if (window.isMaximized()) 
            {
                window.unmaximize();
            } 

            else 
            {
                window.maximize();
            }
        });

        document.getElementById("close-btn").addEventListener("click", (e) => 
        {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });
    };

    document.onreadystatechange = () => 
    {
        if (document.readyState == "complete") 
        {
            init();
        }
    };
})();