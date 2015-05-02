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
        return callback(null, [])
    }
  })
};
//GET ONE
exports.obj = function (id, callback) {
  var search = new cps.SearchRequest(cps.Term(id, "id"))
  conn.sendRequest(search, function(err, resp){
    if (err){
      console.error(err)
      return callback(err)
    }else{
      if(resp.results)
        return callback(null, resp.results.document[0])
      else
        return callback(null, null)
    }
  })
};

// ADD
exports.add = function (obj, callback) {
  obj.id = crypto.randomBytes(20).toString('hex');
  var insert_req = new cps.InsertRequest(obj);
  conn.sendRequest(insert_req, function (err, list_resp) {
    if (err){
      console.error(err)
      return callback(err)
    }else{
      return callback(null, obj)
    }
  });
};

// EDIT
exports.edit = function (obj, callback) {
  var  upd = new cps.UpdateRequest(obj)
  conn.sendRequest(upd, function(err, resp){
    if (err){
      console.error(err)
      return callback(err)
    }else{
      return callback(null, obj)
    }
  })
};

// DELETE
exports.delete = function (obj, callback) {
  var  del = new cps.DeleteRequest(obj)
  conn.sendRequest(del, function(err, resp){
    if (err){
      console.error(err)
      return callback(err)
    }else{
      obj.deleted = true;
      return callback(null, obj)
    }
  })
};
