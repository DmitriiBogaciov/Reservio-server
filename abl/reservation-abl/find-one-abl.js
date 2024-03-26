const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

async function FindOneAbl(id) {
    try {
        const reservation = await dao.FindOne(id);
        return reservation;
    } catch (error) {
        throw error;
    }
}

module.exports = FindOneAbl;