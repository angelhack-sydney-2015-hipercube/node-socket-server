var cps = require('cps-api')

var conn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'docs', 'luigibertaco@gmail.com', 'unsecurePass123', 'document', '//document/id', {account: 100091});

// GET ALL
exports.all = function (callback) {
  var search = new cps.SearchRequest('*',0,99999)
  conn.sendRequest(search, function(err, resp){
    if (err){
      console.error(err)
      return callback(err)
    }else{
      if(resp.results)
        return callback(null, resp.results.document)
      else
        return callback(null, {})
    }
  })
};
