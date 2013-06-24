require('../../_helper');
var Test = require('../../../lib/web_test/test');

var args, test;

valid_args = {
  id: 'SOME-8-LE',
  location: 'Dulles:Canary.DSL',
  uri: 'http://www.someurl.com/',
  name: 'Some Url',
  fvonly : 1,
  runs : 4,
  'private' : 0
};

expect('web-test-callback');

test = new Test(valid_args);

fulfill('web-test-callback');

// testing attributes
assert.equal(test.name, valid_args.name);
assert.equal(test.label, 'some-url');
assert.ok(test.url);
assert.equal(test.group_id, 'global');
assert.equal(test.id, valid_args.id);
assert.equal(test.id.length, 9);
assert.ok(test.created_at);

//testing web test attributes
var attr = test.getParams();
assert.equal(attr.fvonly, 1);
assert.ok(attr.label);
assert.ok(attr.location);
assert.ok(attr.runs);
assert.equal(attr.f, 'json');
assert.equal(attr.r, 1);
assert.equal(attr.noopt, 1);
assert.equal(attr.noimages, 1);
assert.equal(attr['private'], 0);
assert.ok(attr.url);

console.log('✓ - WebTest ' + new Date() );

// assert.ok(value, message)
// assert.equal(actual, expected, message) - comparison by ==
// assert.notEqual(actual, expected, message)
// assert.deepEqual(actual, expect, message) - recursive comparison
// assert.notDeepEqual(actual, expect, message)
// assert.strictEqual(actual, expected, message) - comparison by ===
// assert.notStrictEqual(actual, expected, message)
// assert.throws(block, error, message)
// assert.doesNotThrow(block, error, message)
