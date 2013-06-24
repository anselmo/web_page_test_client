require('../../_helper');

var handler = require('../../../lib/utils/handler'),
    path = require('path');

// fixtures
var layout_b  = 'other';
var partial_a = 'a';
var partial_b = 'b';
var data = {style: 'some', uri:'http://somelink.org', src:'/someimage.png'};


// ---------------------------
// Instatiation
// ---------------------------

var handle = new handler({dir: path.resolve(__dirname, '../../fixtures/views')});

assert.ok(handle, 'exists');
assert.ok(handle.dir, 'exists');
 

// ---------------------------
// render partial
// ---------------------------

output = handle.render(partial_a, data, {layout: false});
assert.ok(output, 'renders a partial');
assert.ok(output.match(new RegExp('somelink.org')), 'renders the partial');

// ---------------------------
// render partial with layout
// ---------------------------

output = null;

output = handle.render(partial_a, data);
assert.ok(output, 'renders a layout with a partial');
assert.ok(output.match(new RegExp('DOCTYPE')), 'renders the layout');

console.log(output);






// TODO
/*
// assert
// 
// 
// throw an error when layout not available
// 
// throe an error when partial not available
// 
// has a default layout
// 
// can overide a layout
// 
// render partial with a layout
// 
// render a partial
// 
// precompiles in production mode
// 
// recompiles in dev and test mode
// 
// loads a bunch of helpers
// */
//
//
// ---------------------------
// precompile layouts
// ---------------------------

// var f;
// for(f in handle.compiled_layouts){
//   if(f){
//     assert.equal(typeof(handle.compiled_layouts[f]), 'function', 'precompiled ' + f + 'layout');
//   }
// }
//
//
//
// _______________________________
//engine.registerHelper('link_to', function(title, context) {
//  return "<a href='/posts" + context.id + "'>" + title + "</a>";
//});

//
