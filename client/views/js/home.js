$(document).ready(function () 
{
    const newMapList = [
        "mp_deathrun_boss", "mp_deathrun_bounce_v3", "mp_deathrun_city", "mp_deathrun_coyote", "mp_deathrun_coyote_v2", 
        "mp_deathrun_dragonball", "mp_deathrun_epicfail", "mp_deathrun_fusion", "mp_deathrun_iceops", 
        "mp_deathrun_minecraft", "mp_deathrun_palm", "mp_deathrun_saw", "mp_deathrun_shadow", "mp_deathrun_simplist", 
        "mp_deathrun_snowic", "mp_deathrun_spaceball", "mp_deathrun_tropic", "mp_deathrun_winter", "mp_dr_away", 
        "mp_dr_biohazard", "mp_dr_bouncev2", "mp_dr_dawn", "mp_dr_disco", "mp_dr_heaven", "mp_dr_jurapark", "mp_dr_lolz", 
        "mp_dr_lovelyplanet", "mp_dr_meatboy", "mp_dr_mew", "mp_dr_mirrors_edge", "mp_dr_mystic", "mp_dr_nighty", 
        "mp_dr_pyramid", "mp_dr_samsara", "mp_dr_sm64", "mp_dr_stonerun", "mp_dr_volpe"
    ]

    var itemsMainDiv = ('.MultiCarousel');
    var itemsDiv = ('.MultiCarousel-inner');
    var itemWidth = "";

    $('.leftLst, .rightLst').click(function () 
    {
        var condition = $(this).hasClass("leftLst");
        if (condition)
            click(0, this);
        else
            click(1, this);
    });
    ResCarouselSize();

    $(window).resize(function () 
    {
        ResCarouselSize();
    });

    //this function define the size of the items
    function ResCarouselSize() 
    {
        var incno = 0;
        var dataItems = ("data-items");
        var itemClass = ('.item');
        var id = 0;
        var btnParentSb = '';
        var itemsSplit = '';
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $('body').width();

        $(itemsDiv).each(function () 
        {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            $(this).parent().attr("id", "MultiCarousel" + id);

            if (bodyWidth >= 1200) 
            {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 992) 
            {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 768) 
            {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            }
            else 
            {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }

            $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(this).find(itemClass).each(function () 
            {
                $(this).outerWidth(itemWidth);
            });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");

        });
    }

    //this function used to move the items
    function ResCarousel(e, el, s) 
    {
        var leftBtn = ('.leftLst');
        var rightBtn = ('.rightLst');
        var translateXval = '';
        var divStyle = $(el + ' ' + itemsDiv).css('transform');
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);

        if (e == 0) 
        {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + ' ' + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) 
            {
                translateXval = 0;
                $(el + ' ' + leftBtn).addClass("over");
            }
        }
        else if (e == 1) 
        {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + ' ' + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) 
            {
                translateXval = itemsCondition;
                $(el + ' ' + rightBtn).addClass("over");
            }
        }
        $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
    }

    //It is used to get some elements from btn
    function click(ell, ee) 
    {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

    // load images in carousel
    function loadMapImages() 
    {
        setTimeout(() => 
        {
            for (let i = 0; i < newMapList.length; i++) 
            {
                let url = "images/loadscreen_not_found.jpg";
                if (FileTest("http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + newMapList[i] + ".jpg"))
                    url = "http://213.32.18.205:1337/speedrun_app/views/images/loadscreen/loadscreen_" + newMapList[i] + ".jpg";

                let shortname = newMapList[i].replace("mp_deathrun_", "").replace("mp_dr_", "")
                    .replace("mp_", "").replace("_", " ");
                shortname = shortname.charAt(0).toUpperCase() + shortname.slice(1);

                $(".MultiCarousel-inner").append(
                    "<div class=\"item shadow-p\">" +
                    "<div class=\"pad5\">" +
                    "<img src=\"" + url + "\" class=\"img-fluid\">" +
                    "<p>" + shortname + "</p>" +
                    "</div>" +
                    "</div>");
            }
            ResCarouselSize();
        });
    }
    loadMapImages();
});

function FileTest(url) 
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();

    if (xhr.status == "404")
        return false;
    else
        return true;
}

