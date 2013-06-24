var strata = require('strata'),
    redirect = strata.redirect,
    path = require('path'),
    util = require('util'),
    handler = require(__dirname + '/lib/utils/handler'),
    redis = require('redis');
    app = new strata.build();

var handle = new handler({dir: path.join(__dirname, 'views')});
var client = redis.createClient();

app.use(strata.commonLogger);
app.use(strata.contentType, "text/html");
app.use(strata.contentLength);
app.use(strata.file, path.join(__dirname, 'public'));

function parseResult(data){
  return data.map(function(d){return JSON.parse(d);});
}

app.get("/", function (env, callback) {
  
  var content = handle.render('index', {});
  callback(200, {}, content);

});

app.get("/results", function (env, callback) {
  client.lrange(['wpt.global',0,-1], function(err, res){
    var data = parseResult(res).reverse();
    callback(200, {contentType: "application/json"}, JSON.stringify(data));
  });

});

//wpt.005.repeat.fullyLoaded
app.get("/results/*", function (env, callback) {
  var key =  env.route[0].split('/')[2];
  client.lrange([key,0,-1], function(err, res){
    var content = handle.render('results/show', { data : res });
    callback(200, {}, content);
  });

});

module.exports = app;


