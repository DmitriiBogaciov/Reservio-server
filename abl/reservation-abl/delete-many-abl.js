const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();

async function DeleteManyAbl(filter) {
    try {
        const result = await dao.DeleteMany(filter);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteManyAbl;