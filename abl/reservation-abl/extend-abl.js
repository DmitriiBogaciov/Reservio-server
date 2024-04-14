const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();
const Workspace = require("../../dao/model/workspace-model");
const CheckNextReservation = require("./utils/check-next-reservation");

async function ExtendAbl(id) {
    try {
        // check time 
        const currentHour = new Date();
        const currentMinutes = currentHour.getMinutes();
        // if ((59 - currentMinutes) > 5) {
        //     const error = new Error("Can't extend the reservation at this time");
        //     error.status = 400;
        //     throw error;
        // }

        const reservation = await dao.FindOne(id);

        // check if is active
        if (!reservation.active) {
            const error = new Error("Can't extend the reservation if reservation is not active");
            error.status = 402;
            throw error;
        }

        //check workspace availability
        const workspace = CheckNextReservation([reservation.workspace])

        if (workspace.status === "unavailable") {
            const error = new Error("Can't extend the reservation, workspace is occupied");
            error.status = 403;
            throw error;
        }

        // extend reservation

        currentHour.setHours(currentHour.getHours() + 1)
        currentHour.setMinutes(59, 0, 0);
        const newTime = {
            endTime: currentHour
        }

        const extendedReservation = await dao.FindByIdAndUpdate(id, newTime)

        return extendedReservation;
    } catch (error) {
        throw error;
    }
}

module.exports = ExtendAbl;