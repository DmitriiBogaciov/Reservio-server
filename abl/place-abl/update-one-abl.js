const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const PlaceSchema = require("../../api/validation-types/place-types");
const PlaceDao = require("../../dao/place-dao");
const dao = new PlaceDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(PlaceSchema.updateDtoInType);

async function UpdateOneAbl(id, placeData) {
    try {
        const valid = validate(placeData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const place = await dao.FindOne(id);

        const result = await dao.UpdateOne(id, placeData);
        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = UpdateOneAbl;