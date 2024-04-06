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
        required: false
    },
    category: {
        type: String,
        required: false,
        index: true
    },
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    features: {
        type: [{
            type: String,
            required: true
        }],
        required: false
    },
    openingTime: {
        type: Date,
        required: false,
        index: true
    },
    closingTime: {
        type: Date,
        required: false,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);