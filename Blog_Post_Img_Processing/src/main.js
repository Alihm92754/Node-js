const mongoose = require('mongoose');
const app = require('./app')
const socket = require('./socketIo');


mongoose.connect('mongodb+srv://AliHm:778899@nodeexpressprojects.xjjbzzg.mongodb.net/blog?retryWrites=true&w=majority&appName=NodeExpressProjects')
.then(() => {
    const server = app.listen(3000, () => {
        console.log("Server is up and running on port 3000")
    })

    socket.initSocket(server);
    

}).catch(err => {
    console.log(err)
    throw new Error('Database connection failed!')
})