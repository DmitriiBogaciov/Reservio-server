const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ReservationSchema = require("../../api/validation-types/reservation-types");
const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(ReservationSchema.createDtoInType)

async function CreateAbl(reservationData, user) {
    try {
        const valid = validate(reservationData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const newReservation = {
            ...reservationData,
            "active": false
        }

        const result = await dao.Create(newReservation);
        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = CreateAbl;