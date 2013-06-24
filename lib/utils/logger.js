var fs = require('fs');

function Logger(args){
  args = args || {};
  this.filename = args.filename || 'log';
  this.path = (args.path + '/' + this.filename) || (_dirname + '/../../log/' + this.filename);
  return this;
}

Logger.prototype.info = function(msg){
  this.write('INFO', msg);
  return this;
};

Logger.prototype.error = function(msg){
  this.write('ERROR', msg);
  return this;
};

Logger.prototype.warn = function(msg){
  this.write('WARN', msg, obj);
  return this;
};

Logger.prototype.debug = function(msg){
  this.write('DEBUG', msg, obj);
  return this;
};

Logger.prototype.write = function(mode, msg){

  var now, stream;

  stream = fs.createWriteStream(this.path, {
    'flags': 'a+',
    'encoding': 'utf8'
   // 'mode': '0644'
  });
  
  var data = Date.now() + ' [' + mode + '] ' + msg + '\n'; 
  
  stream.write(data, 'utf8');
  stream.end();

  return this;


};

module.exports = Logger;

