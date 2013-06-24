var utils = require('util'),
  test = require(__dirname + '/test'),
  fs = require('fs'),
  runner = require(__dirname + '/runner'),
  listener = require(__dirname + '/listener'),
  result = require(__dirname + '/result');

function Manager(args, callback){
  this.idle = [];
  this.active = [];
  this.complete = [];
  this.state = false;
  this.startTime = Date.now();
  return this;
}

// Manager.prototype.start = function(){
//   this.state(true);
//   this.run();
//   return this;
// };

Manager.prototype.run = function(){
  var _this = this;
  while(this.state){
    _this.run();
  }
};

// Manager.prototype.stop = function(test){
//   this.state = false;
// };

Manager.prototype.add = function(test){
  this.idle.push(test);
  return this;
};

Manager.prototype.add = function(test){
  this.idle.push(test);
  return this;
};

Manager.prototype.remove = function(test, src){
  src = src || 'idle';
  this[src] = this[src].filter(function(t){ test.id != t.id;});
  return this;
};

Manager.prototype.move = function(test_id, src, target){
  var _this = this;
  this[src].forEach(function(t){
    if(t.id===test_id){
      _this.remove(t,src);
      _this[target].push(t);
    }
  });
  return this;
};

Manager.prototype.next = function(callback){
  var test;
  test = this.idle.shift();
  if (test){
    this.run(test);
  }
  if (typeof(callback) === 'function'){callback.call(this);}
  return this;
};

Manager.prototype.run = function(test, callback){
  r = new runner(test);
  this.bindListeners(r, test);
  this.active.push(test);
  r.start();
  if (typeof(callback) === 'function') {callback.call(this);}
  return this;
};

Manager.prototype.bindListeners = function(runner, test){
 
  var l = new listener(this);
  runner.on('start', l.start);
  runner.on('requestStart', l.request);
  runner.on('requestOk', l.requestOk);
  runner.on('requestError', l.requestError);
  runner.on('check', l.check);
  runner.on('checkError', l.checkError);
  runner.on('testPending', l.testPending);
  runner.on('testStart', l.testComplete);
  runner.on('testComplete', l.testComplete);
  runner.on('testError', l.testError);
  runner.on('result', l.result);
  runner.on('resultOk', l.resultOk);
  runner.on('resultError', l.resultError);
  runner.on('parse', l.parse);
  runner.on('parseOk', l.parseOk);
  runner.on('finish', l.finish);

};

Manager.prototype.runComplete = function(runner){
 
  var args, r;
  
  args = {
    startTime : runner.startTime,
    endTime : runner.endTime,
    test : {
      id : runner.test.id,
      name : runner.test.name,
      group_id : runner.test.group_id,
      url : runner.test.url,
      hits : runner.hits
    },
    data : runner.result
  };

  r = new result(args);
  r.serialize();
  this.next();

  r.onSaveComplete = function(){
    console.log('Save Completed');
  };

};

module.exports = Manager;




// if (err) throw err;
