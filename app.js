const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

connectionList = {}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// This will emit the event to all connected sockets
io.emit('chat message', { msg: "A user has connected", name: "Admin" })


io.on('connection', (socket) => {
    const _id = socket.id

    io.emit('chat message', { msg: "A user has connected", name: "Admin" })
    console.log('a user connected');
    

    socket.on('connected', (name) => {
        connectionList[_id] = name
        io.emit('connected', connectionList);
    })

    
    socket.on('disconnect', () => {
        io.emit('chat message', {msg: `${connectionList[_id]} has disconnected`, name: "Admin"});
        delete connectionList[_id]
        
        io.emit('connected', connectionList)
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

});


server.listen(3000, () => {
    console.log('listening on localhost:3000');
});