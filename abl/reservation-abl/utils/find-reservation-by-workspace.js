const ReservationDao = require("../../../dao/reservation-dao");
const dao = new ReservationDao();

async function FindResByWorkspace(workspaceId, startTime, endTime) {
    try {
        const reservations = await dao.Find(
            {
                workspace: workspaceId,
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        )

        if(reservations.length === 0){
            const error = new Error("Dind't find reservations");
            error.status = 400;
            throw error;
        }


        return reservations[0];
    } catch (error) {
        throw error;
    }
}

module.exports = FindResByWorkspace;