const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eBookScehma = new Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
}, {
    timeStamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('Ebook', eBookScehma);