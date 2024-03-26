const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

async function FindAbl(filter, projection, options) {
    try {
        const reservations = await dao.Find(filter, projection, options);
        return reservations;
    } catch (error) {
        throw error;
    }
}

module.exports = FindAbl;