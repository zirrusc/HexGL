var bkcore=bkcore||{};bkcore.Ladder={},bkcore.Ladder.global={},bkcore.Ladder.load=function(a){var b=encodeURIComponent(window.location.href);bkcore.Utils.request("brain.php",!1,function(b){try{bkcore.Ladder.global=JSON.parse(b.responseText),a&&a.call(window)}catch(c){console.warn("Unable to load ladder. "+c)}},{u:b})},bkcore.Ladder.displayLadder=function(a,b,c,d){var e=document.getElementById(a);if(void 0==e||void 0==bkcore.Ladder.global[b]||void 0==!bkcore.Ladder.global[b][c])return void console.warn("Undefined ladder.");for(var f=bkcore.Ladder.global[b][c],g="",h=(Math.min(void 0==d?10:d,f.length-1),0);h<f.length-1;h++){var i=bkcore.Timer.msToTime(f[h].score);g+='<span class="ladder-row"><b>'+(h+1)+". "+f[h].name+"</b><i>"+i.m+"'"+i.s+"''"+i.ms+"</i></span>"}e.innerHTML=g};
//# sourceMappingURL=Ladder.map