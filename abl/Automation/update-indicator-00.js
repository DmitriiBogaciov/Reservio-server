const Workspace = require("../../dao/model/workspace-model");
const SetLedState = require("../IoTNode-abl/set-led-state-abl")

async function UpdateAt00() {
    try {
        //resive current hour
        const currentHour = new Date();
        currentHour.setMinutes(0,0,0);
        const nextHour = new Date(currentHour);
        nextHour.setHours(currentHour.getHours() + 1);

        const workspacesWithReservations = await Workspace.aggregate([
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

        for (const workspace of workspacesWithReservations) {
            // Отправляем команду на обновление цвета индикатора на IoT устройстве
            await SetLedState(workspace.deviceId, { state: workspace.status });
        }

        return workspacesWithReservations;

    } catch (error) {
        console.error("Error updating workspace indicators:", error);
    }
}

module.exports = UpdateAt00;