const ReservationDao = require('../../dao/reservation-dao');
const dao = new ReservationDao();
const Workspace = require("../../dao/model/workspace-model");
const CheckNextReservation = require("./utils/check-next-reservation");
const sendEmail = require("../utils/emailBuilder");
const SetLedState = require("../IoTNode-abl/set-led-state-abl");

async function ExtendAbl(id) {
    let reservation;
    let workspaceIot = {};
    try {
        // check time 
        const currentTime = new Date();

        reservation = await dao.FindOne(id);

        const endTime = new Date(reservation.endTime);
        const timeDifference = (endTime - currentTime) / (1000 * 60); // Difference in minutes

        const foundWorkspace = await Workspace.aggregate([
            {
                $match: {
                    _id: reservation.workspace
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
                    deviceId: '$iotnode.deviceId',
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);

        if (foundWorkspace.length !== 0) {
            workspaceIot = foundWorkspace[0]

        if (timeDifference > 5) {
            const error = new Error("Can't extend the reservation at this time");
            error.status = 400;
            throw error;
        }

        // check if is active
        if (!reservation.active) {
            const error = new Error("Can't extend the reservation if reservation is not active");
            error.status = 402;
            throw error;
        }

        //check workspace availability
        const workspace = CheckNextReservation([reservation.workspace])

        if (workspace.status === "unavailable") {
            const error = new Error("Can't extend the reservation, workspace is occupied");
            error.status = 403;
            throw error;
        }

        } else {
            const error = new Error("The workspace doesn't exist");
            error.status = 401; // Bad Request
            throw error;
        }


        // extend reservation

        // currentHour.setHours(currentHour.getHours() + 1)
        // currentHour.setMinutes(59, 0, 0);
        const newTime = {
            endTime: endTime.setHours(endTime.getHours() + 1)
        }

        const extendedReservation = await dao.FindByIdAndUpdate(id, newTime);

        if(workspaceIot.deviceId) {
            await SetLedState(workspaceIot.deviceId, { state: "extended" });
        }

        const subject = 'Reservation Extended';
        const htmlContent = `
            <html>
                <body>
                    <h1>Your reservation ${reservation.name} has been extended</h1>
                    <p>Dear User,</p>
                    <p>Your reservation has been successfully extended to ${newTime}.</p>
                    <p>Best regards,</p>
                    <p>Your Company Name</p>
                </body>
            </html>`;
        await sendEmail(reservation.user, subject, htmlContent);

        return extendedReservation;
    } catch (error) {

        if(workspaceIot.deviceId) {
            await SetLedState(workspaceIot.deviceId, { state: "warning" });
        }
        // Send email about failed extension
        const subject = 'Failed to Extend Reservation';
        const htmlContent = `
            <html>
                <body>
                    <h1>Failed to extend your reservation ${reservation.name}</h1>
                    <p>Dear User,</p>
                    <p>Unfortunately, we could not extend your reservation due to the following reason:</p>
                    <p><strong>${error.message}</strong></p>
                    <p>Best regards,</p>
                    <p>Your Company Name</p>
                </body>
            </html>`;
        await sendEmail(reservation.user, subject, htmlContent);

        error.status = error.status || 500;
        throw error;
    }
}

module.exports = ExtendAbl;