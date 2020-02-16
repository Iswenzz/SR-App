const open = require('opn');

/**
 * Open a link to your default browser.
 */
$(document).on("click", ".btn", function () 
{
    open($(this).attr("opn"));
});
