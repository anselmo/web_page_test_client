define(['js/vendor/handlebars'],function(handlebars){
  var article = "<article class='result'><div class='result-title'><h1>{{t}}</h1><h3>{{description}}</h3></div>{{{kpisView}}}</article>";
  var kpiGroup = "<div class='kpi-group'><div class='kpi-result'><h4 class='kpi-title'>{{name}}</h4><div class='regular'><span class='kpi-value'>{{value}}</span><span class='kpi-unit'>{{unit}}</span><div class='kpi-plot-group js-plot-chart' id='{{id}}'></div></div></div></div>";

  var viewTemplates = {
    article: handlebars.compile(article),
    kpigroup: handlebars.compile(kpiGroup)
  };

  return viewTemplates;

});
  
