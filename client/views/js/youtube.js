var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubePlayerAPIReady() 
{
    player = new YT.Player('mainPlayer', 
    {
        height: '360',
        width: '640',
        videoId: 'jWdY87MpQZs',
        playerVars: { 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'rel': 0, 'enablejsapi':1, 'wmode' : 'transparent'},
        events : { 'onReady' : onPlayerReady, 'onStateChange' : onPlayerStateChange }
    });
}

function onPlayerStateChange(e) 
{
    var frm = $(e.target.getIframe());

    if (e.data === YT.PlayerState.ENDED) 
    {
        if ('mainPlayer' === frm.attr('id')) 
            player.playVideo();
    }
}

function onPlayerReady(e) 
{
    e.target.setPlaybackQuality('hd720');
}
           
var enableYoutube = () =>
{
    var deferred = $.Deferred();
    var img = new Image();
    img.onload = () => { return deferred.resolve(); };
    img.onerror = () => { return deferred.reject(); };
    img.src = "https://www.youtube.com/yts/img/pixel-vfl3z5WfW.gif?"+ new Date().getTime();
    return deferred.promise();
};
           
$.when(enableYoutube()).done(() =>
{
    $('body').append('<script type="text/javascript" src="//d1wfiv6sf8d64f.cloudfront.net/static/pc/js/player.js"><\/script>');
}).fail(() => { });
