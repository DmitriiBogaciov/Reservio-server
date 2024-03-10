const { name } = require("ejs");

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
            images: {
                type: "array",
                items: { type: "string" }
            },
            address: { type: "string" },
            owner: { type: "string" },
            category: { type: "string" },
            openingTime: { type: "string", pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$" },
            closingTime: { type: "string", pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$" }
        },
        required: []
    }
}