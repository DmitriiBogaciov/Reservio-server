const WorkspaceDao = require("../../dao/workspace-dao");
const wDao = new WorkspaceDao();
const ReservationDao = require("../../dao/reservation-dao");
const rDao = new ReservationDao();

async function Update00() {
    try {
        //resive current hour
        const currentHour = new Date();
        currentHour.setMinutes(0,0,0);
        const nextHour = new Date(currentHour);
        nextHour.setHours(currentHour.getHours() + 1);

        const workspaces = await wDao.Find({ IoTNodeId : { $exists: true, $ne: null }});

        const workspaceIds = workspaces.map(workspace => workspace._id);

        const reservations = await rDao.Find({
            workspace: { $in: workspaceIds },
            startTime: { $lt: nextHour },
            endTime: { $gte: currentHour }

        })

    } catch (error) {
        console.error("Error updating workspace indicators:", error);
    }
}

module.exports = Update00;