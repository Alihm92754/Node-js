const socketIO = require('socket.io');

let io;

function initSocket(server) {
    io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('new client connected ', socket )
        io.emit('welcome', 'Welcome to my socketIO server ' + socket.id)
    })
}

function getSocketIO() {
    if(!io) {
        throw new Error('Socket.IO not Initialized');   
    }
    return io
}

module.exports = {
    initSocket,
    getSocketIO
}
