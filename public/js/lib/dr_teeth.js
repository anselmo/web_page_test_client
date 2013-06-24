define(['js/lib/list_view','reqwest','qwery'],function(listView,reqwest,qwery){

  function DrTeeth(args){
    console.log(reqwest);
  }

  DrTeeth.prototype.start = function(){
    //add global menu
   
    //add results
    //
    this.listView = new listView({target:'div.results'});
    this.getResults(4);
  };

  DrTeeth.prototype.getResults = function(size){
    var _this = this;
    reqwest({
      url: '/results',
      type: 'json',
      method: 'get',
      error: function(err){ 
        console.log(err);
      },
      success: function(data){
        _this.addResults(data);
      }
    });
  };

  DrTeeth.prototype.addResults = function(results){
    var r;
    for(r in results){
      if(r){
        this.listView.prepend('article', results[r]);
      }
    }
  };

  return DrTeeth;

});
