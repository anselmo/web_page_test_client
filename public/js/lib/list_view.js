define(['js/lib/templates','handlebars','bonzo','qwery'],function(template, handlebars, _b, $){

  function ListView(args){
    this.target = args.target;
    console.log(template);
  }

  ListView.prototype.addItem = function(){
    console.log('add item');
  };

  ListView.prototype.prepend = function(t, data){
    console.log(data);

    var kpis = [];

    kpis.push({
      name: 'ttfb',
      value: (Number(data.kpis['first.ttfb'])/1000).toFixed(3),
      unit: 'sec'
    });
    kpis.push({
      name: 'render',
      value: (Number(data.kpis['first.render'])/1000).toFixed(3),
      unit: 'sec'
    });
    kpis.push({
      name: 'doc.time',
      value: (Number(data.kpis['first.docTime'])/1000).toFixed(3),
      unit: 'sec'
    });
    
    kpis.push({
      name: 'requests',
      value: data.kpis['first.requests'],
      unit: ''
    });

    kpis.push({
      name: 'bytes.in',
      value: (Number(data.kpis['first.bytesIn'])/1024).toFixed(2),
      unit: 'kb'
    });

    data.kpisView = kpis.map(function(k){ return template.kpigroup(k); }).join('');
    data.description = new Date(data.createTime).toDateString();
    data.t = data.name.split('(')[0];
    var item = template[t](data);

    _b($(this.target)).append(item);
    console.log(item);
  };
  
  ListView.prototype.append = function(){
    
  };

  return ListView;

});

