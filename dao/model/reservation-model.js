const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    workspace: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    activate: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);