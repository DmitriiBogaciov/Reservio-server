const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const CheckAvalilability = require("../reservation-abl/utils/check-availability");
const ReservationSchema = require("../../api/validation-types/reservation-types");
const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(ReservationSchema.createDtoInType)

async function CreateAbl(reservationData) {
    try {
        const valid = validate(reservationData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const available = await CheckAvalilability(reservationData.workspace, reservationData.startTime, reservationData.endTime);

        if (!available) {
            const error = new Error("The workspace is occupied at this time");
            error.status = 401;
            throw error;
        }

        function generatePassword() {
            const password = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return password;
        }

        let password;
        let isUnique = false;

        while (!isUnique) {
            password = generatePassword();

            const existingReservations = await dao.Find({ password });

            if (existingReservations.length === 0) {
                isUnique = true;
            }
        }

        const newReservation = {
            ...reservationData,
            "active": false,
            "password": password
        }

        const result = await dao.Create(newReservation);
        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = CreateAbl;