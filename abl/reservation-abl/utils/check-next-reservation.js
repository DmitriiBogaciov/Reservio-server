const Workspace = require("../../../dao/model/workspace-model");

async function CheckNextReservation(workspaces) {

    try {
        const currentHour = new Date();
        currentHour.setMinutes(0, 0, 0);
        const nextHourStart = new Date(currentHour);
        nextHourStart.setHours(currentHour.getHours() + 1);
        const nextHourEnd = new Date(nextHourStart);
        nextHourEnd.setHours(nextHourStart.getHours() + 1);

        const workspaceIds = workspaces.map(workspace => workspace._id);

        const workspacesAggregate = await Workspace.aggregate([
            {
                $match: {
                    IoTNodeId: { $exists: true, $ne: null },
                    _id: { $in: workspaceIds }
                }
            },
            {
                $lookup: {
                    from: 'iotnodes',
                    localField: 'IoTNodeId',
                    foreignField: '_id',
                    as: 'iotnode'
                }
            },
            {
                $unwind: '$iotnode'
            },
            {
                $addFields: {
                    deviceId: '$iotnode.deviceId'
                }
            },
            {
                $lookup: {
                    from: 'reservations',
                    let: { workspaceId: '$_id', nextHourStart: nextHourStart, nextHourEnd: nextHourEnd },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$workspace', '$$workspaceId'] },
                                        { $gte: ['$startTime', '$$nextHourStart'] },
                                        { $lt: ['$startTime', '$$nextHourEnd'] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                active: 1
                            }
                        }
                    ],
                    as: 'nextReservations'
                }
            },
            {
                $addFields: {
                    status: {
                        $cond: {
                            if: { $gt: [{ $size: "$nextReservations" }, 0] },
                            then: 'unavailable',
                            else: 'available'
                        }
                    }
                }
            }
        ]);

        return workspacesAggregate;
    } catch (error) {
        throw error;
    }
}

module.exports = CheckNextReservation;