var bkcore=bkcore||{};bkcore.Timer=function(){this.time={start:0,current:0,previous:0,elapsed:0,delta:0},this.active=!1},bkcore.Timer.prototype.start=function(){var a=(new Date).getTime();this.time.start=a,this.time.current=a,this.time.previous=a,this.time.elapsed=0,this.time.delta=0,this.active=!0},bkcore.Timer.prototype.pause=function(a){this.active=!a},bkcore.Timer.prototype.update=function(){if(this.active){var a=(new Date).getTime();this.time.current=a,this.time.elapsed=this.time.current-this.time.start,this.time.delta=a-this.time.previous,this.time.previous=a}},bkcore.Timer.prototype.getElapsedTime=function(){return bkcore.Timer.msToTime(this.time.elapsed)},bkcore.Timer.msToTime=function(a){var b,c,d,e;return b=a%1e3,c=Math.floor(a/1e3%60),d=Math.floor(a/6e4%60),e=Math.floor(a/36e5),{h:e,m:d,s:c,ms:b}},bkcore.Timer.msToTimeString=function(a){var b,c,d,e;return b=a%1e3,10>b?b="00"+b:100>b&&(b="0"+b),c=Math.floor(a/1e3%60),10>c&&(c="0"+c),d=Math.floor(a/6e4%60),e=Math.floor(a/36e5),{h:e,m:d,s:c,ms:b}};
//# sourceMappingURL=Timer.map