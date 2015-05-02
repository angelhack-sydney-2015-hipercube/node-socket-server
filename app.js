var net = require('net')
var cp = require('./cp-api')

// Keep track of the chat clients
var clients = [];

net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort

  // Put this new client in the list
  clients.push(socket)

  getAll(socket)

  // Send a nice welcome message and announce
  socket.write("Welcome " + socket.name + "\n");
  broadcast(socket.name + " joined the chat\n", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    var req = JSON.parse(data)
    if(req.request == 'list')   getAll(socket)
    if(req.request == 'get')    getObj(socket, req.id)
    if(req.request == 'add')    addObj(socket, req.obj)
    if(req.request == 'edit')   editObj(socket, req.obj)
    if(req.request == 'delete') deleteObj(socket, req.obj)
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
      if(err) return console.error('err')
      console.log('client ' + client.name + ' >> getAll')
      client.write(JSON.stringify(data)+"\n")
    })
  }

  function getObj(client, id){
    cp.obj(id, function(err, data){
      if(err) return console.error('err')
      console.log('client ' + client.name + ' >> getObj')
      client.write(JSON.stringify(data))
    })
  }

  function addObj(client, obj){
    cp.add(obj, function(err, data){
      if(err) return console.error('err')
      console.log('client ' + client.name + ' >> addObj')
      //client.write(JSON.stringify(data))
      broadcast(JSON.stringify(data),null)
    })
  }

  function editObj(client, obj){
    cp.edit(obj, function(err, data){
      if(err) return console.error('err')
      console.log('client ' + client.name + ' >> editObj')
      broadcast(JSON.stringify(data),null)
    })
  }

  function deleteObj(client, obj){
    cp.delete(obj, function(err, data){
      if(err) return console.error('err')
      console.log('client ' + client.name + ' >> deleteObj')
      broadcast(JSON.stringify(data),null)
    })
  }

}).listen(3000,"0.0.0.0");

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 3000\n");
