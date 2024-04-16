const IoTNode = require("../../dao/model/IoTNode-model");
const Workspace = require("../../dao/model/workspace-model");
const CheckNextReservation = require("../reservation-abl/utils/check-next-reservation");
const SetLedState = require("../IoTNode-abl/set-led-state-abl");

async function UpdateIndicator(deviceId) {
    try {
        const currentHour = new Date();
        currentHour.setMinutes(0, 0, 0);

        const currentMinutes = new Date().getMinutes();
        const nextHour = new Date(currentHour);
        nextHour.setHours(currentHour.getHours() + 1);

        const iotNodeData = await IoTNode.findOne({ deviceId: deviceId });
        if (!iotNodeData) {
            throw new Error("IoT node not found.");
        }

        const workspaceData = await Workspace.findOne({ IoTNodeId: iotNodeData._id });
        if (!workspaceData) {
            throw new Error("Workspace not found.");
        }

        const workspace = await Workspace.aggregate([
            {
                $match: {
                    _id: workspaceData._id
                }
            },
            {
                $lookup: {
                    from: 'reservations',
                    let: { workspaceId: '$_id', currentHour: currentHour, nextHour: nextHour },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$workspace', '$$workspaceId'] },
                                        { $lt: ['$startTime', '$$nextHour'] },
                                        { $gte: ['$endTime', '$$currentHour'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'currentReservations'
                }
            },
            {
                $addFields: {
                    status: {
                        $cond: {
                            if: { $eq: [{ $size: "$currentReservations" }, 0] },
                            then: 'available',
                            else: 'unavailable'
                        }
                    }
                }
            }
        ]);

        let reservationWithNextReservation = [];

        console.log(workspace[0])

        if(workspace[0].status === 'available' & currentMinutes > 1) {
            reservationWithNextReservation = await CheckNextReservation([workspace[0]])
            console.log(reservationWithNextReservation);
        } else if (workspace[0].currentReservations[0].active) {
            workspace[0].status = 'occupied'
            reservationWithNextReservation = workspace;
        } else{
            reservationWithNextReservation = workspace;
        }

        console.log(reservationWithNextReservation);
        console.log(deviceId, { state: reservationWithNextReservation[0].status })
        await SetLedState(deviceId, { state: reservationWithNextReservation[0].status });

        return (workspace)
        
    } catch (error) {
        console.error("Error updating workspace indicators:", error);
    }

}

module.exports = UpdateIndicator;