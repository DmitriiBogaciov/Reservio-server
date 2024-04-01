module.exports = {
    createDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            workspace: { type: "string", minLength: 1, maxLength: 100 },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" }
        },
        required: ["name", "workspace", "startTime", "endTime"]
    },

    updateDtoInType: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            workspace: { type: "string", minLength: 1, maxLength: 100 },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            active: { type: "boolean" }
        },
        required: [],
        additionalProperties: false
    },

    activateDtoInType: {
        type: "object",
        properties: {
            id: { type: "string", minLength: 1, maxLength: 100 },
            state: { type: "string", enum: ["activate", "deactivate"] }
        },
        required: ["id", "state"]
    }
}