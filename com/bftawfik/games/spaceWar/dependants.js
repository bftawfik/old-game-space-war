//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function Dependants(){
  this.afterAllLoaded = "";
  this.init = function(){
    this.ownDependants = [];
    for(var depCount = 0; depCount < arguments.length; depCount++){
      var dependant = {
        path: arguments[depCount],
        loaded: false
      }
      this.ownDependants.push(dependant);
    }
  };
  this.setDependant = function(url){
    //console.log('setDependant');
    for(var depCount = 0; depCount < this.ownDependants.length; depCount++){
      if(url == this.ownDependants[depCount].path){
        this.ownDependants[depCount].loaded = true;
      }
    }
    this.chickAllLoaded();
  };
  this.loadAll = function(funcName){
    this.afterAllLoaded = funcName;
    var that = this;
    for(var depCount = 0; depCount < this.ownDependants.length; depCount++){
      $.getScript( this.ownDependants[depCount].path, function( data, textStatus, jqxhr,dep = that) {
        dep.setDependant(this.url.slice(0,this.url.indexOf(".js")+3));
      });
    }
  };
  this.chickAllLoaded = function(){
    var allLoaded = true;
    for(var depCount = 0; depCount < this.ownDependants.length; depCount++){
      if(! this.ownDependants[depCount].loaded){
        return this.ownDependants[depCount].loaded;
      }
    }
    window[this.afterAllLoaded]();
  }
};
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
