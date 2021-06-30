const socket = require('socket.io')

const SOCKET = (server)=>{
    const io = socket(server);
    var userCounts = 0; // io.engine.ClientsCount

    io.on('connection',(_socket)=>{
        userCounts++;
        console.log(`socket connection established with ${_socket.id} ${userCounts}`);
        
        io.sockets.emit('chat',{message:`⬤ ${userCounts} users Online`,handle:'server'})
        _socket.on('chat',(data)=>{
            io.sockets.emit('chat',data)
        })
        
        _socket.on('disconnect',(reason)=>{
            userCounts--;
            io.sockets.emit('chat',{message:`⬤ ${userCounts} users Online`,handle:'server'})
        })
    })
}

module.exports = SOCKET;