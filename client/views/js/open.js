const open = require('opn');

$(document).on("click", ".btn", function () 
{
    open($(this).attr("opn"));
});
