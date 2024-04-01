const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ReservationSchema = require("../../api/validation-types/reservation-types");
const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(ReservationSchema.activateDtoInType)

async function ActivateAbl(id, state) {
    try {
        const valid = validate({id, state});
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const reservation = await dao.FindOne(id);

        let activeValue = state === "active" ? true : false;


        data = {
            active: activeValue
        }

        const result = await dao.UpdateOne(id, data);
        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = ActivateAbl;