require('../../_helper');
var Manager = require('../../../lib/web_test/manager');
var Runner = require('../../../lib/web_test/runner');

var args, test, manager;

valid_args = {
  name : 'some name'
};

manager = new Manager();
// 
// // -------------------------------
// // core collections idle, active, complete
// // -------------------------------
// 
assert.equal(manager.idle.length,0);
assert.equal(manager.active.length,0);
assert.equal(manager.complete.length,0);
assert.ok(manager.startTime);
// 
// 
// // -------------------------------
// // add test
// // -------------------------------
// 
assert.equal(manager.add({id:'abcdefghi'}), manager);
assert.equal(manager.idle.length, 1);
// 
// 
// // -------------------------------
// // remove test 
// // -------------------------------

manager.remove('abcdefghi','idle');
assert.equal(manager.idle.length, 0);
manager.remove('abcdefghi','idle');


// -------------------------------
// move and remove tests across state ['idle','active','complete']
// -------------------------------

manager.add({id:'abcdefghi'});
assert.equal(manager.idle.length, 1);
assert.equal(manager.active.length, 0);
manager.move('abcdefghi', 'idle','active');
assert.equal(manager.active.length, 1);
assert.equal(manager.idle.length, 0);
assert.equal(manager.complete.length, 0);
manager.move('abcdefghi', 'active','complete');
assert.equal(manager.complete.length, 1);
manager.remove('abcdefghi', 'complete');
assert.equal(manager.complete.length, 0);

// 
// // -------------------------------
// // process test
// // -------------------------------
//
//
expect('call-next');
t = {id:'abcdefghi', getParams:false};
manager.add(t);
assert.equal(manager.idle.length, 1);

manager.next(function(){
  fulfill('call-next');
});


assert.equal(manager.idle.length, 0);
assert.equal(manager.active.length, 1);


console.log('✓ - ' + __filename.split('/')[8] );

// assert.ok(value, message)
// assert.equal(actual, expected, message) - comparison by ==
// assert.notEqual(actual, expected, message)
// assert.deepEqual(actual, expect, message) - recursive comparison
// assert.notDeepEqual(actual, expect, message)
// assert.strictEqual(actual, expected, message) - comparison by ===
// assert.notStrictEqual(actual, expected, message)
// assert.throws(block, error, message)
// assert.doesNotThrow(block, error, message)
