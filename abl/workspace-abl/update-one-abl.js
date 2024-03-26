const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const WorkspaceSchema = require("../../api/validation-types/workspace-types");
const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(WorkspaceSchema.updateDtoInType);

async function UpdateOneAbl(id, workspaceData) {
    try {
        const valid = validate(workspaceData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const workspace = await dao.FindOne(id);

        const result = await dao.UpdateOne(id, workspaceData);
        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = UpdateOneAbl;