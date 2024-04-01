module.exports = {
    createDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100}
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
            features: { type: "array", items: { type: "string" }},
            openingTime: { type: "string", format: "date-time" },
            closingTime: { type: "string", format: "date-time" }
        },
        required: []
    }
}