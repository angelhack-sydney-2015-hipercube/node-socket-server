var net = require('net')
var cp = require('./cp-api')
var http = require('https')

// Keep track of the chat clients
var clients = [];

net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort

  // Put this new client in the list
  clients.push(socket)

  getAll(socket)

  // getSTT()

  // Send a nice welcome message and announce
  socket.write("Welcome " + socket.name + "\n");
  broadcast(socket.name + " joined the chat\n", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    if(req = JSON.parse(data)){
      if(req.request == 'list')   return getAll(socket)
      if(req.request == 'get')    return getObj(socket, req.id)
      if(req.request == 'add')    return addObj(socket, req.obj)
      if(req.request == 'edit')   return editObj(socket, req.obj)
      if(req.request == 'delete') return deleteObj(socket, req.obj)
    }
    //broadcast(socket.name + " >> " + data + "\n");
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " left the chat!!!\n");
  });

  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }

  function getAll(client){
    cp.all(function(err, data){
      if(err) return console.error(err)
      console.log('client ' + client.name + ' >> getAll\n')
      client.write(JSON.stringify(data)+"\n")
    })
  }

  function getObj(client, id){
    cp.obj(id, function(err, data){
      if(err) return console.error(err)
      console.log('client ' + client.name + ' >> getObj\n')
      client.write(JSON.stringify(data))
    })
  }

  function addObj(client, obj){
    cp.add(obj, function(err, data){
      if(err) return console.error(err)
      console.log('client ' + client.name + ' >> addObj\n')
      broadcast(JSON.stringify(data),null)
    })
  }

  function editObj(client, obj){
    cp.edit(obj, function(err, data){
      if(err) return console.error(err)
      console.log('client ' + client.name + ' >> editObj\n')
      broadcast(JSON.stringify(data),null)
    })
  }

  function deleteObj(client, obj){
    cp.delete(obj, function(err, data){
      if(err) return console.error(err)
      console.log('client ' + client.name + ' >> deleteObj\n')
      broadcast(JSON.stringify(data),null)
    })
  }

}).listen(3000,"0.0.0.0");

// cp.all(function(err, data){
//   if(err) return console.error(err)
//   console.log(JSON.stringify(data)+"\n")
//   var arr = JSON.stringify(data)
//   for(var i = 0; i <= arr.length; i++){
//     if(arr[i].HPjobID){
//       http.get('https://api.idolondemand.com/1/job/status/usw3p_d4b18e35-1de5-4cfb-a9ab-1e9e62462d3e?apikey=c1333e51-2dc5-4cc3-907a-c49490941706',function(response){
//         response.setEncoding('utf8');
//         response.on('data', function(data){
//           console.log(data);
//         });
//       })
//     }
//   }
// })

// function getSTT(){
  // cp.all(function(err, data){
  //   if(err) return console.error('err')
  //   var arr = JSON.stringfy(data);
    // for(var i = 0; i <= arr.length; i++){
    //   // if(arr[i].HPjobID){
    //   //   http.get('https://api.idolondemand.com/1/job/status/usw3p_d4b18e35-1de5-4cfb-a9ab-1e9e62462d3e?apikey=c1333e51-2dc5-4cc3-907a-c49490941706',function(response){
    //   //     response.setEncoding('utf8');
    //   //     response.on('data', function(data){
    //   //       console.log(data);
    //   //     });
    //   //   })
    //   // }
    // }
  // })
//}

// Put a friendly message on the terminal of the server.
console.log("Server running at port 3000\n");
