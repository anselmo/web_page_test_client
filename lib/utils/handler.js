var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    engine = require('handlebars');

function Handler(args){
  args = args || {};
  this.dir = args.dir || path.join( __dirname, './views');
  this.default_layout = args.default_layout || 'default';
  this.ext = args.ext || 'hdb';
  
  this.compiled_layouts = {};
  this.compiled_partials = {};

  console.log(this.dir);

  // this.precompile = args.precompile || true;

  // if(this.precompile){
  //   this.compile_layouts();
  // }

  return this;
}

// Handler.prototype.compile_layouts = function(){
//   var l, name;
//   var files = fs.readdirSync(path.join(this.dir, 'layouts'));
//   
//   for(l in files){
//     if(l && files[l].match(new RegExp(this.ext))){
//       name = files[l].split('.')[0];
//       this.compiled_layouts[name] = this.compile(path.join(this.dir, 'layouts' , l));
//     }
//   }
// 
// };
// 
Handler.prototype.read = function(temp){
  if(fs.existsSync(temp)){
    return fs.readFileSync(temp).toString();
  } else {
    return false;
  }
};

// --------------------------
// Render
// --------------------------

Handler.prototype.compile = function(temp){
  fun = engine.compile(this.read(temp));
  return fun;
};

Handler.prototype.render_with_layout = function(temp, context, args){
  var layout_path, output, partial;
  layout_path = path.join(this.dir, 'layouts', (args.layout || this.default_layout) + '.' + this.ext);
  partial = this.render_partial(temp,context);
  output = this.render_partial(layout_path,{content: partial});
  return output;

};

Handler.prototype.render_partial = function(temp, context){
  return this.compile(temp)(context);
};

Handler.prototype.render = function(temp, context, args){
  
  var output;
  temp = path.join(this.dir, temp + '.' + this.ext);
  
  args = args || {};

  if ( args.layout || args.layout === null || args.layout === undefined){
    output = this.render_with_layout(temp, context, args);
  } else {
    output = this.render_partial(temp, context);
  }
  
  return output;

};

module.exports = Handler;
