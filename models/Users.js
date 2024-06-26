const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    colors: {
        type: [String], 
        required: true
    },
    pricePerGram: {
        type: Number,
        required: true
    },
    applicationTypes: {
        type: [String], 
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('fetchIt', userSchema);
