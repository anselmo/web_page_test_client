var shortid = require('shortid');

var WEB_TEST_LOCATION = 'Dulles:Canary.DSL',
    WEB_TEST_GROUP = 'global',
    WEB_TEST_DEFAULTS = {
      fvonly : 0,
      'location' : WEB_TEST_LOCATION,
      runs : 1,
      f : 'json',
      r : 1,
      noopt : 1,
      'private' : 1,
      noimages : 1
    };

function Test(args, callback){
  var k;
  args = args || {};

  this.created_at = Date.now();
  this.id = args.id || shortid.generate();
  this.name = args.name || 'unamed';
  this.label = args.label || this.name.replace(/\s/g,'-').toLowerCase();
  this.url = args.url || args.uri;
  this.group_id = args.group_id || WEB_TEST_GROUP;
  
  for (k in WEB_TEST_DEFAULTS){
    if(k) {
      this[k] = (args[k] === null || args[k] === undefined) ? WEB_TEST_DEFAULTS[k] : args[k];
    }
  }

  if(callback){ callback(this); }

  return this;
}

Test.prototype.getParams = function(){
  var params = {
    fvonly : this.fvonly,
    label : this.label,
    'location' : this.location,
    runs : this.runs,
    f : this.f,
    r : this.r,
    noopt : this.noopt,
    noimages : this.noimages,
    'private' : this['private'],
    url : this.url
  };
  return params;
};

module.exports = Test;
