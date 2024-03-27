const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IoTNodeSchema = new Schema({
    deviceId: {
        type: String,
        required: true
    },
    sharedAccessKey: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('IoTNode', IoTNodeSchema);