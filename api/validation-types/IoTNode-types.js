module.exports = {
    createDtoInType: {
        type: "object",
        properties: {
            deviceId: { type: "string", minLength: 1, maxLength: 100},
            sharedAccessKey: { type: "string", minLength: 1, maxLength: 1000}
        },
        required: ["deviceId", "sharedAccessKey"]
    },

    updateDtoInType: {
        type: "object",
        properties: {
            deviceId: { type: "string", minLength: 1, maxLength: 100},
            sharedAccessKey: { type: "string", minLength: 1, maxLength: 1000}
        },
        required: ["deviceId", "sharedAccessKey"]
    }
}