function ImageRepository(funcName) {
  //--
  var numImages = 1;
	var numLoaded = 0;
  //--
  this.afterAllLoaded = funcName;
  this.imageLoaded = function() {
		//console.log('imageLoaded');
    numLoaded++;
    if(numLoaded == numImages){
      //console.log('all Images are loaded');
      window[this.afterAllLoaded]();
    }
	}
  //--
  this.createImage = function(parent, url){
    var bgImage = new Image();
    bgImage.parent = parent;
    bgImage.onload = function() {
      bgImage.parent.imageLoaded();
    }
    bgImage.src = url;
    return bgImage;
  }
  //--
  this.init = function(){
    this.gameImg = this.createImage(this, "img/main.png");
  }
  //--
  this.init();
}
