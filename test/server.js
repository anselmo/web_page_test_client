var http = require('http'),
    path = require('path'),
    url  = require('url'),
    fs = require('fs'),
    util = require('util'),
    mock = require(__dirname + '/fixtures/response_fixtures');

var port = 6767;
var s;

exports.start = function(){
  s = http.createServer(function (req, resp) {
    var params = url.parse(req.url);
    s.emit(params.pathname, req, resp);
  });
  console.log('*** WebTest-server running at http://127.0.0.1:6767/');
  s.listen(port, function () {
    var f, fixture;
    for (f in mock){
      if (f){eventForFixture(s,mock[f]);}
    }
  });  
};

var eventForFixture = function(server, fixture){
  server.on(fixture.url, function(req, res){
    var f, scope, params, xmlResultFile, stat, readStream;
    
    params = url.parse(req.url);
    scope = {status: 501, contentType: 'text/html', body: 'service unavailable'};
    
    for (f in fixture.scope){
      if (params.query && params.query.match(new RegExp(f)) || params.pathname.match(new RegExp(f))){
        scope = fixture.scope[f];
      }
    }
    
    //stream xmlfile
    if (scope.file){
      
      xmlResultFile = __dirname + "/fixtures/" + scope.file;

      stat = fs.statSync(xmlResultFile); 
      res.writeHead(scope.status , {'content-type': scope.contentType, 'content-length': stat.size });

      readStream = fs.createReadStream(xmlResultFile);
      util.pump(readStream, res);
    
      //responde with fixture data
    } else {

      res.writeHead(scope.status , {'content-type': scope.contentType });
      res.end(scope.body);

    }
  });
};

exports.close = function(){
  console.log('*** WebTest-server close');
  s.close();
};

