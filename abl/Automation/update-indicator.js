const Workspace = require("../../dao/model/workspace-model");
const CheckNextReservation = require("./check-next-reservation")
const SetLedState = require("../IoTNode-abl/set-led-state-abl")

async function UpdateIndicator() {
    try {
        //resive current hour
        const currentHour = new Date();
        currentHour.setMinutes(0, 0, 0);

        const currentMinutes = new Date().getMinutes();
        const nextHour = new Date(currentHour);
        nextHour.setHours(currentHour.getHours() + 1);

        const workspacesWithReservationsAggregate = await Workspace.aggregate([
            {
                $match: {
                    IoTNodeId: { $exists: true, $ne: null }
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
                        },
                        {
                            $project: {
                                _id: 1,
                                active: 1 // Предполагается, что поле active указывает на статус резервации
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
                            then: 'green', // нет текущих резерваций
                            else: {
                                $cond: {
                                    if: { $anyElementTrue: "$currentReservations.active" },
                                    then: 'blue', // есть активная резервация
                                    else: 'red' // резервация есть, но она неактивна
                                }
                            }
                        }
                    }
                }
            }
        ]);

        const workspacesWithCurrentReservations = [];
        const workspacesWithoutReservations = [];

        for (const workspace of workspacesWithReservationsAggregate) {
            if (workspace.status === 'green') {
                workspacesWithoutReservations.push(workspace);
                console.log("There is a workspace without current reservation")
            } else {
                workspacesWithCurrentReservations.push(workspace);
            }
        }

        let workspacesWithNextReservations = [];
        let allWorkspacesToUpdate = [];

        if (currentMinutes > 30) {
            workspacesWithNextReservations = await CheckNextReservation(workspacesWithoutReservations);
            allWorkspacesToUpdate = workspacesWithCurrentReservations.concat(workspacesWithNextReservations);
            console.log("Without reesrvation", allWorkspacesToUpdate)
        } else {
            allWorkspacesToUpdate = workspacesWithCurrentReservations.concat(workspacesWithoutReservations);
            console.log(allWorkspacesToUpdate)
        }

        for (const workspace of allWorkspacesToUpdate) {
            await SetLedState(workspace.deviceId, { state: workspace.status });
        }

        return {
            allWorkspacesToUpdate
        };

    } catch (error) {
        console.error("Error updating workspace indicators:", error);
    }
}

module.exports = UpdateIndicator;