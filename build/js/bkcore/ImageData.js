var bkcore=bkcore||{};bkcore.ImageData=function(a,b){var c=this;this.image=new Image,this.pixels=null,this.canvas=null,this.loaded=!1,this.image.onload=function(){c.canvas=document.createElement("canvas"),c.canvas.width=c.image.width,c.canvas.height=c.image.height;var a=c.canvas.getContext("2d");a.drawImage(c.image,0,0),c.pixels=a.getImageData(0,0,c.canvas.width,c.canvas.height),c.loaded=!0,a=null,c.canvas=null,c.image=null,b&&b.call(c)},this.image.crossOrigin="anonymous",this.image.src=a},bkcore.ImageData.prototype.getPixel=function(a,b){if(null==this.pixels||0>a||0>b||a>=this.pixels.width||b>=this.pixels.height)return{r:0,g:0,b:0,a:0};var c=4*(b*this.pixels.width+a);return{r:this.pixels.data[c],g:this.pixels.data[c+1],b:this.pixels.data[c+2],a:this.pixels.data[c+3]}},bkcore.ImageData.prototype.getPixelBilinear=function(a,b){var c,d,e,f,g,h,i=Math.floor(a),j=Math.floor(b),k=a-i-.5,l=b-j-.5,m=Math.abs(k),n=Math.abs(l),o=0>k?-1:1,p=0>l?-1:1;return c=this.getPixel(i,j),e=this.getPixel(i+o,j),f=this.getPixel(i,j+p),d=this.getPixel(i+o,j+p),g=[(1-m)*c.r+m*e.r,(1-m)*c.g+m*e.g,(1-m)*c.b+m*e.b,(1-m)*c.a+m*e.a],h=[(1-m)*f.r+m*d.r,(1-m)*f.g+m*d.g,(1-m)*f.b+m*d.b,(1-m)*f.a+m*d.a],{r:(1-n)*g[0]+n*h[0],g:(1-n)*g[1]+n*h[1],b:(1-n)*g[2]+n*h[2],a:(1-n)*g[3]+n*h[3]}},bkcore.ImageData.prototype.getPixelF=function(a,b){var c=this.getPixel(a,b);return c.r+255*c.g+255*c.b*255},bkcore.ImageData.prototype.getPixelFBilinear=function(a,b){var c=this.getPixelBilinear(a,b);return c.r+255*c.g+255*c.b*255};
//# sourceMappingURL=ImageData.map