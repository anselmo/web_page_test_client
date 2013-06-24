require('../../_helper');
var Result = require('../../../lib/web_test/result'),
    config = require(__dirname + '/../../../config/' + (process.env.NODE_ENV || 'development')),
    fs = require('fs');

var args = require('../../fixtures/result_args');

var result = new Result(args.valid);

// -------------------------------
// about the test
// -------------------------------

assert.ok(result.id, 'has an id');
assert.ok(result.test, 'has a reference test [used on serialization keys]');
assert.ok(result.createTime);

// currently theres only one test source
assert.equal(result.kind, 'wpt');

assert.ok(result.test.id);
assert.ok(result.test.name);
assert.ok(result.test.group_id);
assert.ok(result.test.url);

assert.ok(result.data, 'has the test result data');
assert.ok(result.kpis, 'has a set of kpis');

// -------------------------------
// kpis
// -------------------------------


assert.ok(result.toStrip(), 'has a striped representation');
assert.ok(result.toString(), 'has a string representation');

// -------------------------------
// dump result to disk
// -------------------------------

var removeTestAssets = function(result){
  var dir = result.dirName();
  fs.unlink(result.fullPath(), function(err){
    fs.rmdir(dir);
  });
};

Result.dump(result, function(){
  assert.equal(result.id, require(result.fullPath()).id, 'it can be dump to disk');
  removeTestAssets(result);
});

// -------------------------------
// Keys for serialization
// -------------------------------

assert.equal(result.key(), 'wpt.12345678', 'has a key for a test list');
assert.equal(result.keyForKPI('first.ttfb'), 'wpt.12345678.first.ttfb', 'has a list key for a kpi');

// -------------------------------
// save test result to redis
// -------------------------------

result.remove(function(err, res){
  
  assert.equal(result.__index__, null, 'it has no ondex reference');

  result.save(function(err, res){
    assert.equal(res, 1, 'theres only one index');
    assert.equal(result.__index__, res, 'sets a local index reference');
  });

});

// -------------------------------
// save denormalized kpis to redis lists
// -------------------------------

(function removeKeys(){
  var k;
  for(k in result.kpis){
    if(k){ Result.remove(result.keyForKPI(k)); }
  }
}).call(this);

expect('save-complete');

result.onSaveComplete = function(){
  assert.equal(result.__indexed__, result.KPIsLength());
  fulfill('save-complete');
};

result.saveKPIs(function(err,res){
  assert.equal(result.__index__, res);
});

assert.equal(result.KPIsLength(), 10);
