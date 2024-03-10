const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const PlaceSchema = require("../../api/controllers/validation-types/place-types");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(PlaceSchema.createDtoInType)

async function CreateAbl(placeData, owner) {
    try {
        const valid = validate(placeData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const newPlace = {
            ...placeData,
            "owner": owner,
        }

        return newPlace;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = CreateAbl;