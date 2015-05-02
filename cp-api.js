var cps = require('cps-api')

var conn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'posts', 'manuel@gizmomen.com', 'tiburcio34', 'document', '//document/id', {account: 100034});

// GET ALL
exports.all = function (callback) {
 var search = new cps.SearchRequest('*',0,99999)
 conn.sendRequest(search, function(err, resp){
   if (err){
     console.error(err)
     return callback(err)
   }else{
     return callback(null, resp.results.document)
   }
 })
};
