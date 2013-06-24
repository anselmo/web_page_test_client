
var fixtures = {};

fixtures.runtest = {
  url: '/runtest',
  scope: {
    abcdefghi: {
      contentType: 'application/json',
      status: 200,
      body: '{"statusCode":200,"statusText":"Ok","data":{"testId":"120808_EJ_J0","ownerKey":"ow","jsonUrl":"js","xmlUrl":"h","userUrl":"someurl","summaryCSV":"summaryCSVURL","detailCSV":"detailCSV"}}'
    },
    unavailable: {
      contentType: 'text/html',
      status: 501,
      body: 'Service unavailable'
    },
    invalid_args: {
      contentType: 'text/html',
      status: 401,
      body: 'invalid arguments'
    }
  }
};


fixtures.testStatus = {
  url: '/testStatus',
  scope: {
    '120808_EJ_J0' : {
      contentType: 'application/json',
      status: 200,
      body: '{"statusCode":200, "statusText":"Ok", "data":{"testId":"120808_EJ_J0","ownerKey":"ow","jsonUrl":"js","xmlUrl":"h","userUrl":"someurl","summaryCSV":"summaryCSVURL","detailCSV":"detailCSV"}}'
    },
    'started' : {
      contentType: 'application/json',
      status: 200,
      body: '{"statusCode":101, "statusText":"Test Started"}'
    },
    'pending' : {
      contentType: 'application/json',
      status: 200,
      body: '{"statusCode":100, "statusText":"Test Pending"}'
    },
    'invalid_args' : {
      contentType: 'application/xml',
      status: 401,
      body: ''
    }
  }
};

fixtures.xmlResult = {
  url: '/xmlResult/120808_EJ_J0/',
  scope: {
    '120808_EJ_J0' : {
      contentType: 'application/xml',
      status: 200,
      file: 'xmlresult.sample'
    }
  }
};


fixtures.xmlResultInvalid = {
  url: '/xmlResult/invalid_args/',
  scope: {
    'invalid_args' : {
      contentType: 'text/html',
      status: 401,
      body: 'invalid test'
    }
  }
};

module.exports = fixtures;
