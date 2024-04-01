const Workspace = require("../../dao/model/workspace-model");

async function CheckNextReservation(workspaces) {
    const currentHour = new Date();
    currentHour.setMinutes(0, 0, 0);
    const nextHourStart = new Date(currentHour);
    nextHourStart.setHours(currentHour.getHours() + 1);
    const nextHourEnd = new Date(nextHourStart);
    nextHourEnd.setHours(nextHourStart.getHours() + 1);

    const workspaceIds = workspaces.map(workspace => workspace._id);

    const workspacesWithoutReservationsAggregate = await Workspace.aggregate([
        {
            $match: {
                IoTNodeId: { $exists: true, $ne: null },
                _id: { $in: workspaceIds }
            }
        },
        {
            $lookup: {
                from: 'iotnodes', // Название коллекции IoT устройств
                localField: 'IoTNodeId',
                foreignField: '_id',
                as: 'iotnode'
            }
        },
        {
            $unwind: '$iotnode' // Преобразуем массив iotnode в отдельные документы
        },
        {
            $addFields: {
                deviceId: '$iotnode.deviceId' // Добавляем deviceId из документа IoTNode к каждому рабочему месту
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
        // Теперь добавляем поле статуса на основе наличия предстоящих резерваций
        {
            $addFields: {
                status: {
                    $cond: {
                        if: { $gt: [{ $size: "$nextReservations" }, 0] },
                        then: 'red', // Если есть резервации, статус красный
                        else: 'green' // Если нет, статус зеленый
                    }
                }
            }
        }
    ]);

    return workspacesWithoutReservationsAggregate;
}

module.exports = CheckNextReservation;