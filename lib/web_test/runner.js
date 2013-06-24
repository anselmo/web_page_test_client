var events = require('events'),
    url = require('url'),
    util = require('util'),
    request = require('request'),
    shortid = require('shortid'),
    xml2js = require('xml2js');

function Runner(test, args){

  events.EventEmitter.call(this);

  var _this = this;
  this.active = true;
  this.parse = true;
  this.test = test;
  this.testId = null;
  this.startTime = null;
  this.endTime = null;
  this.result = null;
  this.id = shortid.generate();
  this.hits = 0;
 
  this.start = function(){
    this.startTime = Number(new Date());
    this.emit('start', this);
    this.request();
    return this;
  };

  this.requestParams = function(){
    var t = this.test.getParams();
    t.k = Runner.config.WEB_PAGE_TEST_API_KEY;
    return {url: url.parse(Runner.config.URL_RUN_TEST), timeout: Runner.config.REQ_TIMEOUT, qs: t };
  };

  this.request = function(callback){

    request(this.requestParams(), function (err, res, body) {
      
      if (err) {_this.emit('requestError', err, _this);}

      switch(res.statusCode){
        case 200:
        case 201:
          _this.requestResponse = JSON.parse(body);
          _this.testId = _this.requestResponse.data.testId;
          _this.emit('requestOk', _this);
          setTimeout(function(){_this.check();}, 1);
          break;
        default: 
          _this.emit('requestError', res.statusCode, _this); 
          break;
      }

    });
    return this;
  };

  this.checkParams = function(){
    var t = {f: 'json', test: this.testId, k: Runner.config.WEB_PAGE_TEST_API_KEY};
    return  {url: url.parse(Runner.config.URL_CHECK_STATE), timeout: Runner.config.REQ_TIMEOUT, qs: t };
  };

  this.check = function(){
    _this.hits += 1;
    _this.emit('check', this);
   
    request(this.checkParams(), function (err, res, body) {
      var data, state;
      
      if (err) {_this.emit('checkError', err, _this);}
      
      if (res.statusCode === 200){

        data = JSON.parse(body);
        state = Number(data.statusCode);

        switch(state){
          case 100:
            _this.emit('testPending', _this);
            if (_this.active){
              setTimeout(function(){_this.check();}, Runner.config.CHECK_INTERVAL);
            }
            break;
          case 101:
            _this.emit('testStarted', _this);
            if (_this.active){
              setTimeout(function(){_this.check();}, Runner.config.CHECK_INTERVAL);
            }  
            break;
          case 200:
          case 201:  
            _this.emit('testComplete', _this);
            if (_this.active){
              setTimeout( function(){_this.getResult();}, 1);
            }  
            break;
          default:
            _this.emit('checkError', res.statusCode, _this);
            break;
        }

      } else {
        _this.emit('checkError', res.statusCode, _this);
      }

    });

    return this;
  };
 
  this.resultParams = function(){
    var t = {t: this.testId, k: Runner.config.WEB_PAGE_TEST_API_KEY};
    return {url: Runner.config.URL_GET_RESPONSE.replace(/\{\{test_id\}\}/, this.testId), timeout: Runner.config.REQ_TIMEOUT};
  };

  this.getResult = function(){

    _this.emit('result', this);

    request(this.resultParams(), function (err, res, body) {

      if (err) {_this.emit('resultError', err, _this);}

      if (res && res.statusCode === 200){

        _this.endTime = Number(new Date());
        _this.emit('resultOk', _this);

        if (_this.active && _this.parse){
          
          setTimeout(function(){_this.parseResult(body);}, 1);

        } else {

          _this.result = body;
          _this.emit('finish', _this);

        }

      } else {

        _this.emit('resultError', res.statusCode, _this);

      }

    });
  };

  this.parseResult = function(xmlString){

    _this.emit('parse', this);

     var parser = new xml2js.Parser();

     parser.parseString(xmlString, function (err, result) {
       if (err){
         _this.emit('parseError', err, _this);
         return false;
       }

       _this.result = result.data;
       _this.emit('parseOk', _this);

       setTimeout(function(){_this.emit('finish', _this);}, 1);

       return true;

     });

  };
   
}


Runner.config = require(__dirname + '/../../config/' + (process.env.NODE_ENV || 'development'));

util.inherits(Runner, events.EventEmitter);

module.exports = Runner;
