const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: String,
        index: true,
        required: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        index: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        index: true,
        required: true
    },
    endTime: {
        type: Date,
        index: true,
        required: true
    },
    activate: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);