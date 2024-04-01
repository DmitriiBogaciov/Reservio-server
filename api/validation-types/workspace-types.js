module.exports = {
    createDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100},
            placeId: { type: "string", minLength: 1, maxLength: 100}
        },
        required: ["name", "placeId"]
    },

    updateDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            description: { type: "string", minLength: 1, maxLength: 1000 },
            features: { type: "array", items: { type: "string" }},
            IoTNodeId: { type: "string", minLength: 1, maxLength: 100 },
            placeId: { type: "string", minLength: 1, maxLength: 1000 },
            qr_value: { type: "string", minLength: 1, maxLength: 1000 },
            state: { type: "string", enum: ["free", "reserved", "occupied"] }
        },
        required: [],
        additionalProperties: false
    }
}