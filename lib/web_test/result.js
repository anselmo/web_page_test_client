var shortid = require('shortid'),
    fs = require('fs'),
    redis = require('redis'),
    log = require(__dirname + '/../utils/logger'),
    config = require(__dirname + '/../../config/' + (process.env.NODE_ENV || 'development'));

//this should be a singleton
if (config.LOG){
  var logger = new log({path: config.LOG_PATH, filename: config.LOG_FILENAME + '_' + (process.env.NODE_ENV || 'development') + '.log'});
}  

function Result(args, callback){
  args = args || {};

  this.kind = 'wpt';
  this.id = args.id || shortid.generate();

  this.createTime = Number(new Date());
  this.startTime = args.startTime;
  this.endTime = args.endTime;

  this.test = args.test;
  this.data = args.data;

  this.kpis = this.serializableKPIs(this);
  
  this.__index__ = null;
  this.__indexed__ = 0;

  return this;
}

Result.prototype.fileName = function(){
  return this.id + '.json';
};

Result.prototype.dirName = function(){
  return config.OUTPUT_DIR + '/' + this.test.id;
};

Result.prototype.fullPath = function(){
  return this.dirName() + '/' + this.fileName();
};

Result.prototype.toStrip = function(){
  return {
    kind: this.kind,
    id: this.id,
    test_id : this.test.id,
    createTime: this.createTime,
    startTime: this.startTime,
    endTime: this.endTime,
    group_id: this.test.group_id,
    name: this.test.name,
    url: this.test.url,
    location: this.data.location,
    connectivity: this.data.connectivity,
    completed: this.data.completed,
    runs: this.data.runs,
    repeatView : (this.data.average.repeatView) ? false : true, 
    testFullPath : this.fullPath(),
    kpis : this.kpis
  };
};

Result.prototype.toString = function(){
  return JSON.stringify(this.toStrip());
};

// -----------------------
// Callbacks
// ---------------------------

Result.prototype.onSave = function( err, res, callback){
  this.__index__ = this.__index__ || res;
  this.__indexed__ += 1;
  if(this.__indexed__ === this.KPIsLength()){
    this.onSaveComplete();
    Result.quit(); 
  }
  if(callback){callback(err,res);}
};

Result.prototype.onKPIRemove = function(err, res){
  this.__indexed__ = null ;
};

Result.prototype.onSaveComplete = function(){
  //override this for custom behaviour;
};


// ----------------------------
// Persisting Obj and KPIs
// ----------------------------
Result.prototype.saveKPIs = function(callback){
  var k;
  var _this = this, _onSave = function(err,res){
    _this.onSave(err, res, callback);
  };

  for(k in this.kpis){
    if(k && this.kpis[k]){
      Result.save(this.keyForKPI(k), this.kpis[k], _onSave);
    }
  }
};

Result.prototype.save = function(callback){
  var _this = this;
  Result.save('wpt.global', this.toString(), function(err, res){
    if(err){ throw new Error('Error saving: ' + err); } 
    _this.__index__ = _this.__index__ || res;
    if(callback){ callback(err, res); }
  });
};

//Remove should failed without
Result.prototype.remove = function(callback){
  var _this = this;
  Result.remove(this.key(), function(err, res){
    if(err){ throw new Error('Error removing: ' + err); } 
    _this.__index__ = null;
    if(callback){ callback(err, res); }
  });
};

// TODO::INTRODUCE A TEST
Result.prototype.serialize = function(callback){
  var _this = this;
  logger.info('Save :' + _this.id);
  this.save(function(err, res){
    logger.info('Save-Kpis: ' + _this.id);
    _this.saveKPIs();
    
    logger.info('Dump: ' + _this.id);
    Result.dump(_this);
    
    logger.info('Save: ' + (res-1));
    Result.save(_this.key(), res-1, function(err, res){
      if(err){ throw new Error('Error saving: ' + err); } 
    });

  });
};

// ----------------------------
// KPIs and Keys
// ----------------------------

Result.prototype.key = function(){
  return [this.kind, this.test.id].join('.');
};

Result.prototype.keyForKPI = function(kpi){
  return [this.kind, this.test.id, kpi].join('.');
};

Result.prototype.serializableKPIs = function(obj){
  
  var d = {};

  d.id = this.id;
  d.time = this.createTime;
  
  if(obj.data.median.firstView){
    d['first.loadTime'] = obj.data.median.firstView.loadTime;
    d['first.ttfb'] = obj.data.median.firstView.TTFB;
    d['first.bytesIn'] = obj.data.median.firstView.bytesIn;
    d['first.requests'] = obj.data.median.firstView.requests;
    d['first.render'] = obj.data.median.firstView.render;      
    d['first.fullyLoaded'] = obj.data.median.firstView.fullyLoaded;
    d['first.docTime'] = obj.data.median.firstView.docTime;     
    d['first.domTime'] = obj.data.median.firstView.domTime;
  }

  if (obj.data.median.repeatView){
    d['repeat.loadTime'] = obj.data.median.repeatView.loadTime;
    d['repeat.ttfb'] = obj.data.median.repeatView.TTFB;
    d['repeat.bytesIn'] = obj.data.median.repeatView.bytesIn;
    d['repeat.requests'] = obj.data.median.repeatView.requests;
    d['repeat.render'] = obj.data.median.repeatView.render;      
    d['repeat.fullyLoaded'] = obj.data.median.repeatView.fullyLoaded;
    d['repeat.docTime'] = obj.data.median.repeatView.docTime;     
    d['repeat.domTime'] = obj.data.median.repeatView.domTime;
  }
  
  return d;

};

Result.prototype.KPIsLength = function(obj){
  var z; var t = 0;
  for(z in this.kpis){ 
    if(z){ t += 1; }
  }
  return t;
};





// ---------------------------
// Class Methods (to extend via utile.inherit);
// ---------------------------

Result.dump = function(obj, callback){

  if (!config.OUTPUT_DIR){ throw new Error('Output dir not defined');}
  
  if (!fs.existsSync(obj.dirName())){
    fs.mkdirSync(obj.dirName());
  }

  fs.writeFile( obj.fullPath(), JSON.stringify(obj), function(err) {
    if(err){ throw new Error('Error saving result to disk' + err); } 
    if (callback){ callback.call(obj);}
  });

};

Result.connect = function(){
  Result.__client__ = Result.__client__ || redis.createClient();
  return Result.__client__;
};

Result.quit = function(){
  Result.__client__.quit();
  Result.__client__ = null;
  return true;
};

Result.save = function(key, value, callback){
  client = Result.connect();
  if(client){
    client.rpush([key, value], function(err, res){
      if(callback){ callback(err, res); }
    });
  }
};

Result.remove = function(key, callback){
  client = Result.connect();
  if(client){
    client.del(key, function(err, res){
      if(callback){ callback(err, res);}
    });
  }
};

module.exports = Result; 

