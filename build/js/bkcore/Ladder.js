var bkcore = bkcore || {};
bkcore.Ladder = {};
bkcore.Ladder.global = {};
bkcore.Ladder.load = function(callback) 
{
    var s = encodeURIComponent(window.location.href);
    bkcore.Utils.request("brain.php", false, function(req) 
    {
        try {
            bkcore.Ladder.global = JSON.parse(req.responseText);
            if (callback)
                callback.call(window);
        } 
        catch (e) 
        {
            console.warn('Unable to load ladder. ' + e);
        }
    }, {u: s});
}
bkcore.Ladder.displayLadder = function(id, track, mode, num) 
{
    var d = document.getElementById(id);
    if (d == undefined || bkcore.Ladder.global[track] == undefined || !bkcore.Ladder.global[track][mode] == undefined) 
    {
        console.warn('Undefined ladder.');
        return;
    }
    var l = bkcore.Ladder.global[track][mode];
    var h = '';
    var m = Math.min((num == undefined ? 10 : num), l.length - 1);
    for (var i = 0; i < l.length - 1; i++) 
    {
        var t = bkcore.Timer.msToTime(l[i]['score']);
        h += '<span class="ladder-row"><b>' + (i + 1) + '. ' + l[i]['name'] + '</b><i>' + t.m + '\'' + t.s + '\'\'' + t.ms + '</i></span>';
    }
    d.innerHTML = h;
}