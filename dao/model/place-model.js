const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    address: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    openingTime: {
        type: Date,
        required: false
    },
    closingTime: {
        type: Date,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);