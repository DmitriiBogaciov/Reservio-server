const ReservationDao = require("../../dao/reservation-dao");
const dao = new ReservationDao();
const Workspace = require("../../dao/model/workspace-model");
const SetLedState = require("../IoTNode-abl/set-led-state-abl");
const sendEmail = require("../utils/emailBuilder");

async function NotifyCompletion() {
    try {
        const currentTime = new Date();

        const nextFiveMinutes = new Date(currentTime);
        nextFiveMinutes.setMinutes(currentTime.getMinutes() + 5);

        const filter = {
            active: true,
            endTime: { $gte: currentTime, $lt: nextFiveMinutes }
        };

        const projection = {
            "_id": 1,
            "endTime": 1,
            "workspace": 1,
            "user": 1,
            "name": 1
        };
        const completionReservations = await dao.Find(filter, projection);

        if (completionReservations.length === 0) {
            console.log("No reservations ending within the next hour.");
            return "No reservations to notify.";
        }

        const workspaceIds = completionReservations.map(res => res.workspace);

        const workspaces = await Workspace.aggregate([
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
                    foreignField: "_id",
                    as: 'iotnode'
                }
            }
        ]);

        for (const element of workspaces) {
            if (element.iotnode && element.iotnode.length > 0) {
                await SetLedState(element.iotnode[0].deviceId, { state: "notify" });
            }
        }

        for (const res of completionReservations) {
            const subject = 'Reservation is ending';
            const htmlContent = `<html><body><h1>Your reservation ${res.name} is ending</h1><p>Please extend or make room</p></body></html>`;
            await sendEmail(res.user, subject, htmlContent);
        }

        return ("Notified sucessfully");

    } catch (error) {
        console.error("Error in NotifyCompletion:", error);
    }
}

module.exports = NotifyCompletion;
