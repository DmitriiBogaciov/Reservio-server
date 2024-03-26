const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const WorkspaceSchema = require("../../api/validation-types/workspace-types");
const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

const PlaceDao = require('../../dao/place-dao');
const placeDao = new PlaceDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(WorkspaceSchema.createDtoInType)

async function CreateAbl(workspaceData) {
    try {
        const valid = validate(workspaceData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const place = await placeDao.FindOne(workspaceData.placeId)

        const data = {
            ...workspaceData,
            state: "free"
        }

        const newWorkspace = await dao.Create(data);
        return newWorkspace;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = CreateAbl;