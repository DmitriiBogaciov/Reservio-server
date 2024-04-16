const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const CheckAvailability = require("./utils/check-workpace-availability");
const ReservationSchema = require("../../api/validation-types/reservation-types");
const CheckPlaceAvailability = require("./utils/check-place-availability");
const ReservationDao = require('../../dao/reservation-dao');
const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new ReservationDao();
const workspaceDao = new WorkspaceDao();

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

        const start = new Date(reservationData.startTime);
        start.setMinutes(0,0,0);
        const end = new Date(reservationData.endTime);
        end.setMinutes(59,0,0);

        const difference = (end - start) / (1000 * 60 * 60);
        if (difference > 1.99) {
            const error = new Error("Maximum reservation time is 1:59 hours");
            error.status = 400;
            throw error;
        }

        const workspace = await workspaceDao.FindOne(reservationData.workspace);

        const placeAvailability = await CheckPlaceAvailability(workspace.placeId, start, end);
        if(!placeAvailability) {
            const error = new Error("The reservation hours are out of opening time");
            error.status = 401;
            throw error;
        }

        const available = await CheckAvailability(reservationData.workspace, reservationData.startTime, reservationData.endTime);

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
            "startTime": start,
            "endTime": end,
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