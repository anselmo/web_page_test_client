var Log = require(__dirname + '/../utils/logger'),
    config = require(__dirname + '/../../config/' + (process.env.NODE_ENV || 'development'));

if (config.LOG){
  var logger = new Log({path:config.LOG_PATH, filename: config.LOG_FILENAME + '_' + (process.env.NODE_ENV || 'development') + '.log'});
}  

function Listener(manager){

  this.start = function(obj){
    logger.info('start ' + obj.test.id);
  };

  this.request = function(obj){
    logger.info('request ' + obj.test.id);
  };

  this.requestOk = function(obj){
    logger.info('requestOk ' + obj.test.id);
  };

  this.requestError = function(err, obj){
    logger.error('requestError ' + obj.test.id);
  };
  // check test handlers
  this.check = function(obj){
    logger.info('check ' + obj.test.id);
  };

  this.checkError = function(err, obj){
    logger.error('checkError ' + obj.test.id);
  };

  this.testComplete = function(obj){
    logger.info('testComplete ' + obj.test.id);
  };

  this.testError = function(err, obj){
    logger.error('testError ' + obj.test.id);
  };

  this.testPending = function(obj){
    logger.info('testPending ' + obj.test.id);
  };

  this.result = function(obj){
    logger.info('result ' + obj.test.id);
  };

  this.resultOk = function(obj){
    logger.info('resultOk ' + obj.test.id);
  };

  this.resultError = function(err, obj){
    logger.error('resultError ' + obj.test.id);
  };

  this.parse = function(obj){
    logger.info('parse ' + obj.test.id);
  };

  this.parseOk = function(obj){
    logger.info('parseOk ' + obj.test.id);
  };

  this.parseError = function(err, obj){
    logger.error('rarseError ' + obj.test.id);
  };

  this.finish = function(obj){
    logger.info('finish ' + obj.test.id);
    manager.runComplete(obj);
  };

}

module.exports = Listener; 
