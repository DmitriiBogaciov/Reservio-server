const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
        index: true
    },
    description: {
        type: String,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IoTNode',
        index: true,
        required: false
    },
    qr_value: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);