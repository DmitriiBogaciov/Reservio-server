const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

async function DeleteAbl(id) {
    try {
        const result = await dao.DeleteOne(id);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteAbl;