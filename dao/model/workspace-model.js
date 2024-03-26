const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    placeId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    features: {
        type: [{
            type: String,
            required: true
        }],
        required: false
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: false
    },
    IoTNodeId: {
        type: String,
        required: false
    },
    qr_value: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);