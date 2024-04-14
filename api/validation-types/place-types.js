module.exports = {
    createDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100 }
        },
        required: ["name"]
    },

    updateDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            description: { type: "string", minLength: 1, maxLength: 1000 },
            image: { type: "string", minLength: 1, maxLength: 1000 },
            address: { type: "string" },
            owner: { type: "string" },
            category: { type: "string", minLength: 1, maxLength: 1000 },
            features: { type: "array", items: { type: "string" } },
            openingTime: { "type": "string", "pattern": "^[0-2]?[0-9]:[0-5][0-9]$" },
            closingTime: { "type": "string", "pattern": "^[0-2]?[0-9]:[0-5][0-9]$" }
        },
        required: []
    }
}