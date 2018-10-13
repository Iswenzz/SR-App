const opn = require('opn');

element.addEventListener("click", goToLink);

function goToLink(link) 
{
    opn(link);
} 