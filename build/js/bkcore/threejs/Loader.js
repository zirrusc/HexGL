var bkcore=bkcore||{};bkcore.threejs=bkcore.threejs||{},bkcore.NONE=void 0,bkcore.threejs.Loader=function(a){this.jsonLoader=new THREE.JSONLoader,this.errorCallback=void 0==a.onError?function(a){console.warn("Error while loading %s.".replace("%s",a))}:a.onError,this.loadCallback=void 0==a.onLoad?function(){console.log("Loaded.")}:a.onLoad,this.progressCallback=void 0==a.onProgress?function(){}:a.onProgress,this.types={textures:null,texturesCube:null,geometries:null,analysers:null,images:null,sounds:null},this.states={},this.data={};for(var b in this.types)this.data[b]={},this.states[b]={};this.progress={total:0,remaining:0,loaded:0,finished:!1}},bkcore.threejs.Loader.prototype.load=function(a){for(var b in this.types)if(b in a){var c=0;for(var d in a[b])c++;this.progress.total+=c,this.progress.remaining+=c}for(var e in a.textures)this.loadTexture(e,a.textures[e]);for(var f in a.texturesCube)this.loadTextureCube(f,a.texturesCube[f]);for(var g in a.geometries)this.loadGeometry(g,a.geometries[g]);for(var h in a.analysers)this.loadAnalyser(h,a.analysers[h]);for(var i in a.images)this.loadImage(i,a.images[i]);this.progressCallback.call(this,this.progress)},bkcore.threejs.Loader.prototype.updateState=function(a,b,c){return a in this.types?(1==c&&(this.progress.remaining--,this.progress.loaded++,this.progressCallback.call(this,this.progress,a,b)),this.states[a][b]=c,void(this.progress.loaded==this.progress.total&&this.loadCallback.call(this))):void console.warn("Unkown loader type.")},bkcore.threejs.Loader.prototype.get=function(a,b){return a in this.types?b in this.data[a]?this.data[a][b]:(console.warn("Unkown file."),null):(console.warn("Unkown loader type."),null)},bkcore.threejs.Loader.prototype.loaded=function(a,b){return a in this.types?b in this.states[a]?this.states[a][b]:(console.warn("Unkown file."),null):(console.warn("Unkown loader type."),null)},bkcore.threejs.Loader.prototype.loadTexture=function(a,b){var c=this;this.updateState("textures",a,!1),this.data.textures[a]=THREE.ImageUtils.loadTexture(b,bkcore.NONE,function(){c.updateState("textures",a,!0)},function(){c.errorCallback.call(c,a)})},bkcore.threejs.Loader.prototype.loadTextureCube=function(a,b){var c=this,d=[b.replace("%1","px"),b.replace("%1","nx"),b.replace("%1","py"),b.replace("%1","ny"),b.replace("%1","pz"),b.replace("%1","nz")];this.updateState("texturesCube",a,!1),this.data.texturesCube[a]=THREE.ImageUtils.loadTextureCube(d,new THREE.CubeRefractionMapping,function(){c.updateState("texturesCube",a,!0)})},bkcore.threejs.Loader.prototype.loadGeometry=function(a,b){var c=this;this.data.geometries[a]=null,this.updateState("geometries",a,!1),this.jsonLoader.load(b,function(b){c.data.geometries[a]=b,c.updateState("geometries",a,!0)})},bkcore.threejs.Loader.prototype.loadAnalyser=function(a,b){var c=this;this.updateState("analysers",a,!1),this.data.analysers[a]=new bkcore.ImageData(b,function(){c.updateState("analysers",a,!0)})},bkcore.threejs.Loader.prototype.loadImage=function(a,b){var c=this;this.updateState("images",a,!1);var d=new Image;d.onload=function(){c.updateState("images",a,!0)},d.crossOrigin="anonymous",d.src=b,this.data.images[a]=d};
//# sourceMappingURL=Loader.map