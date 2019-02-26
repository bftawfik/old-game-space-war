function ImageRepository() {
  //========================================================================
  //========================================================================
  //========================================================================
  this.gameImgs = [
    {
      path: "img/portraitPreloaderBg.jpg",
      loaded: 0,
      image: new Image(),
      bytesLoaded: 0,
      bytesTotal: 0,
    },
    {
      path: "img/preloaderBar0.png",
      loaded: 0,
      image: new Image(),
      bytesLoaded: 0,
      bytesTotal: 0,
    },
    {
      path: "img/preloaderBar1.png",
      loaded: 0,
      image: new Image(),
      bytesLoaded: 0,
      bytesTotal: 0,
    },
    {
      path: "img/orient.jpg",
      loaded: 0,
      image: new Image(),
      bytesLoaded: 0,
      bytesTotal: 0,
    },
    {
      path: "img/main.png",
      loaded: 0,
      image: new Image(),
      bytesLoaded: 0,
      bytesTotal: 0,
    },
  ];
  this.mainImageId = 4;
  //========================================================================
  //========================================================================
  //========================================================================
  Image.prototype.load = function(url, imageObj){
    var thisImg = this;
    var thisImageObj = imageObj;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url,true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e) {
      var blob = new Blob([this.response]);
      thisImg.src = window.URL.createObjectURL(blob);
    };
    xmlHTTP.onprogress = function(e) {
      thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
      e.thisImageObj = thisImageObj;
      thisImg.onImageProgress(e);
    };
    xmlHTTP.onloadstart = function() {
      thisImg.completedPercentage = 0;
    };
    xmlHTTP.send();
  };
  Image.prototype.onImageProgress = function(e){
  };
  Image.prototype.completedPercentage = 0;
  //========================================================================
  //========================================================================
  //========================================================================
  this.createImage = function(parent, obj){
    var imageObj = obj;
    imageObj.image.parent = parent;
    imageObj.image.onload = function() {
      imageObj.loaded = 1;
      //console.log(this.parent.getLoadedCount());
      //imageObj.image.parent.checkIfAllLoaded();
    }
    imageObj.image.onImageProgress = function(e){
      e.thisImageObj.bytesLoaded = e.loaded;
      e.thisImageObj.bytesTotal = e.total;
    };
    imageObj.image.load(imageObj.path, imageObj);
  }
  //------------------------------------------------------------------------
  this.init = function(){
    for(var imgCount = 0; imgCount < this.gameImgs.length; imgCount++){
      this.createImage(this, this.gameImgs[imgCount]);
    }
  }
  //------------------------------------------------------------------------
  this.getLoadedCount = function(){
    var loadedImgsCount = 0;
    for(var imgCount = 0; imgCount < this.gameImgs.length; imgCount++){
      if(this.gameImgs[imgCount].loaded == 1){
        loadedImgsCount++;
      }
    }
    return loadedImgsCount;
  }
  //------------------------------------------------------------------------
  this.checkPreloaderImages = function(){
    for(var imgCount = 0; imgCount < 3; imgCount++){
      if(this.gameImgs[imgCount].loaded != 1){
        return false;
      }
    }
    return true;
  }
  //------------------------------------------------------------------------
  this.init();
  //------------------------------------------------------------------------
}
