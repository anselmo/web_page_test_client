require('../../_helper');
var Runner = require('../../../lib/web_test/runner');
var server = require('../../server.js'),
    url = require('url');

// ---------------------------
// Expecations
// ---------------------------

expect('0.0-on-start');
expect('1.0-on-request-ok');
expect('1.1-on-request-error');
expect('1.2-on-service-unavailable');
expect('2.0-on-check');
expect('2.1-on-test-complete');
expect('2.2-on-check-error');
expect('2.3-on-test-pending');
expect('2.4-on-test-started');
expect('3.0-on-result');
expect('3.1-on-result-ok');
expect('3.2-on-result-error');
expect('4.0-on-parse');
expect('4.1-on-parse-ok');
expect('4.2-on-parse-error');
expect('5.0-on-finish');

// ---------------------------
// Start mock server service
// ---------------------------

server.start();
console.log('    Runner Test Start');

function endTest(){
  server.close();
  console.log('    Runner Test End');
}


assert.ok(Runner.config, 'Runner, config loaded');
assert.ok(Runner.config.URL_RUN_TEST, 'Runner, has a url to request the test');

// ---------------------------
// Mocked test
// ---------------------------

valid_test = {
  id: 'abcdefghi', 
  name: 'valid_test',
  getParams: function(){ return {id:'abcdefghi', location:'www.somelocation.com'};}
};

var runner = new Runner(valid_test);

assert.ok(runner.id, 'Runner, has an id');
assert.equal(runner.test, valid_test,'Runner, has a test to run');
assert.equal(runner.hits, 0, 'Runner, hasn`t check for the result');
assert.equal((runner.requestParams()).timeout, Runner.config.REQ_TIMEOUT, 'Runner has request timeout configured');

runner.on('start', function(arg1){
  fulfill('0.0-on-start');
  console.log('0.0 start ✓');
});

runner.on('requestOk', function(){
  assert.ok(runner.requestResponse);
  assert.equal(runner.testId, '120808_EJ_J0');
  fulfill('1.0-on-request-ok');
  console.log('1.0 requestOk ✓');
});

runner.on('check', function(){
  assert.ok(runner.requestResponse);
  assert.equal(runner.hits, 1);
  fulfill('2.0-on-check');
  console.log('2.0 check ✓');
});

runner.on('testComplete', function(){
  fulfill('2.1-on-test-complete');
  console.log('2.1 testComplete (200) ✓');
});

runner.on('result', function(){
  fulfill('3.0-on-result');
  console.log('3.0 result ✓');
});

runner.on('resultOk', function(obj){
  assert.ok(runner.endTime);
  fulfill('3.1-on-result-ok');
  console.log('3.1 resultOk ✓');
});

runner.on('parse', function(obj){
  fulfill('4.0-on-parse');
  console.log('4.0 parse ✓');
});

runner.on('parseOk', function(obj){
  fulfill('4.1-on-parse-ok');
  console.log('4.1 parseOk ✓');
});

runner.on('finish', function(obj){
  fulfill('5.0-on-finish');
  console.log('5.0 finish ✓');
  // close server
  endTest();
});


// ---------------------------
// start runner 
// ---------------------------

runner.start();
assert.ok(runner.startTime, 'Runner, has a start time');

// ---------------------------
// request Error (401 - Invalid args)
// ---------------------------

var test_error_runner = new Runner(valid_test);

test_error_runner.on('requestError', function(res){
  fulfill('1.1-on-request-error');
  console.log('1.1 requestError (401) ✓');
});

test_error_runner.requestParams = function(){
  return {url: url.parse(Runner.config.URL_CHECK_STATE), qs: {id: 'invalid_args'} };
};

test_error_runner.active = false;
test_error_runner.request();

// ---------------------------
// request Error (501 - Service Unavailable)
// ---------------------------

var test_unavailable_runner = new Runner(valid_test);

test_unavailable_runner.on('requestError', function(res){
  fulfill('1.2-on-service-unavailable');
  console.log('1.2 serviceUnavailable (501) ✓');
});

test_unavailable_runner.requestParams = function(){
  return {url: url.parse(Runner.config.URL_CHECK_STATE), qs: {id: 'unavailable'} };
};

test_unavailable_runner.active = false;
test_unavailable_runner.request();


// ---------------------------
// checkTestError
// ---------------------------

var check_test_error_runner = new Runner(valid_test);

check_test_error_runner.on('checkError', function(err, obj){
  fulfill('2.2-on-check-error');
  console.log('2.2 checkError (401) ✓');
});


check_test_error_runner.checkParams = function(){
  return {url: url.parse(Runner.config.URL_RUN_TEST), qs: {test: 'invalid_args'} };
};

check_test_error_runner.active = false;
check_test_error_runner.check();


// ---------------------------
// checkTestPending
// ---------------------------

var check_test_pending_runner = new Runner(valid_test);

check_test_pending_runner.on('testPending', function(err, obj){
  fulfill('2.3-on-test-pending');
  console.log('2.3 testPending (100) ✓');
});

check_test_pending_runner.checkParams = function(){
  return {url: url.parse(Runner.config.URL_CHECK_STATE), qs: {test: 'pending'} };
};

check_test_pending_runner.active = false;
check_test_pending_runner.check();


// ---------------------------
// checkTestStart
// ---------------------------

var check_test_start_runner = new Runner(valid_test);

check_test_start_runner.on('testStarted', function(err, obj){
  fulfill('2.4-on-test-started');
  console.log('2.4 testStarted (101) ✓');
});

check_test_start_runner.checkParams = function(){
  return {url: url.parse(Runner.config.URL_CHECK_STATE), qs: {test: 'started'} };
};

check_test_start_runner.active = false;
check_test_start_runner.check();


// ---------------------------
// resultTestError
// ---------------------------

var result_error_runner = new Runner(valid_test);

result_error_runner.on('resultError', function(code, body){
  fulfill('3.2-on-result-error');
  console.log('3.2 resultError (401) ✓');
});

result_error_runner.resultParams = function(){
  return {url: url.parse(Runner.config.URL_GET_RESPONSE.replace(/\{\{test_id\}\}/, 'invalid_args'))};
};

result_error_runner.getResult();



// ---------------------------
// parse Error
// ---------------------------

var parse_error_runner = new Runner(valid_test);
parse_error_runner.on('parseError', function(err){
  fulfill('4.2-on-parse-error');
  console.log('4.2 parseError (ERR) ✓');
});

parse_error_runner.parseResult('{this is invalid json');

