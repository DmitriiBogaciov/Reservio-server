const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const IoTNodeSchema = require("../../api/validation-types/IoTNode-types");
const IoTNodeDao = require("../../dao/IoTNode-dao");
const dao = new IoTNodeDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(IoTNodeSchema.updateDtoInType);

async function UpdateOneAbl(id, IoTNodeData) {
    try {
        const valid = validate(IoTNodeData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const result = await dao.FindByIdAndUpdate(id, IoTNodeData);
        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = UpdateOneAbl;