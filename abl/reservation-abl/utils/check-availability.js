const ReservationDao = require("../../../dao/reservation-dao");
const dao = new ReservationDao();

async function CheckAvalilability(workspaceId, startTime, endTime) {
    try {
        const reservations = await dao.Find(
            {
                workspace: workspaceId,
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        )

        return reservations.length === 0;
    } catch (error) {
        throw error;
    }
}

module.exports = CheckAvalilability;