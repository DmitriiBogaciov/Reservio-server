const ExtendRes = require("../reservation-abl/extend-abl")
const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();
const IoTNodeDao = require("../../dao/IoTNode-dao");
const IotDao = new IoTNodeDao();
const ReservationDao = require("../../dao/reservation-dao");
const ResDao = new ReservationDao();

async function WorkspaceResExtend(deviceId){
    try {

        const startTime = new Date();
        const endTime = new Date();
        startTime.setMinutes(0,0,0);
        endTime.setMinutes(59,0,0);

        const IotNode = await IotDao.Find(
            {
                deviceId: deviceId
            }
        )

        if( IotNode.length === 0 ) {
            const error = new Error("Dind't find IotNode");
            error.status = 400;
            throw error;
        }

        const workspaces = await dao.Find(
            {
                IoTNodeId: IotNode[0]._id
            }
        )

        if(workspaces.length === 0){
            const error = new Error("Dind't find workspace");
            error.status = 400;
            throw error;
        }

        const reservations = await ResDao.Find(
            {
                workspace: workspaces[0]._id,
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        )

        if(reservations.length === 0){
            const error = new Error("Dind't find reservations");
            error.status = 400;
            throw error;
        }

        const ExtendedReservation = await ExtendRes(reservations[0]._id)

        return ExtendedReservation;
    } catch (error) {
        throw error;
    }
}

module.exports = WorkspaceResExtend;