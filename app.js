var net = require('net')
// Keep track of the chat clients
var clients = [];

net.createServer(function (socket) {



}).listen(3000,"0.0.0.0");

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 3000\n");
