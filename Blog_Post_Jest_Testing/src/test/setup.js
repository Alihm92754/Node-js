const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://AliHm:778899@nodeexpressprojects.xjjbzzg.mongodb.net/testing-blog?retryWrites=true&w=majority&appName=NodeExpressProjects')
})

afterEach(async () => {
    await mongoose.connection.db.dropDatabase({ dbName: 'testing-blog' })
})

afterAll(async () => {
    await mongoose.connection.close()
})