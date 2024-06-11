const Ajv = require("ajv");
const mongoose = require('mongoose');
const addFormats = require("ajv-formats");
const SetLedState = require("../IoTNode-abl/set-led-state-abl");
const CheckAvailability = require("./utils/check-workpace-availability");
const sendEmail = require("../utils/emailBuilder");
const ReservationSchema = require("../../api/validation-types/reservation-types");
const CheckPlaceAvailability = require("./utils/check-place-availability");
const ReservationDao = require('../../dao/reservation-dao');
const Workspace = require("../../dao/model/workspace-model");
const dao = new ReservationDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(ReservationSchema.createDtoInType)

async function CreateAbl(reservationData) {
    try {
        const valid = validate(reservationData);
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const start = new Date(reservationData.startTime);
        start.setMinutes(0, 0, 0);
        const end = new Date(reservationData.endTime);
        end.setMinutes(59, 0, 0);

        const now = new Date();
        now.setMinutes(59, 0, 0);
        now.setHours(now.getHours() - 1);

        if (start < now) {
            const error = new Error("Reservation cannot be created in the past");
            error.status = 400;
            throw error;
        }

        const difference = (end - start) / (1000 * 60 * 60);
        if (difference > 1.99) {
            const error = new Error("Maximum reservation time is 1:59 hours");
            error.status = 400;
            throw error;
        }

        const workspaceId = new mongoose.Types.ObjectId(reservationData.workspace);
        const foundWorkspace = await Workspace.aggregate([
            {
                $match: {
                    _id: workspaceId
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

        let workspace = {};
        if (foundWorkspace.length !== 0) {
            workspace = foundWorkspace[0]
        } else {
            const error = new Error("The workspace doesn't exist");
            error.status = 401; // Bad Request
            throw error;
        }

        const placeAvailability = await CheckPlaceAvailability(workspace.placeId, start, end);
        if (!placeAvailability) {
            const error = new Error("The reservation hours are out of opening time");
            error.status = 401;
            throw error;
        }

        const available = await CheckAvailability(reservationData.workspace, reservationData.startTime, reservationData.endTime);

        if (!available) {
            const error = new Error("The workspace is occupied at this time");
            error.status = 401;
            throw error;
        }

        function generatePassword() {
            const password = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return password;
        }

        let password;
        let isUnique = false;

        while (!isUnique) {
            password = generatePassword();

            const existingReservations = await dao.Find({ password });

            if (existingReservations.length === 0) {
                isUnique = true;
            }
        }

        const newReservation = {
            ...reservationData,
            "startTime": start,
            "endTime": end,
            "active": false,
            "password": password
        }

        const result = await dao.Create(newReservation);

        const subject = 'Your Reservation Details';
        const htmlContent = `
            <html>
                <body>
                    <h1>Your reservation ${result.name}</h1>
                    <p>Dear User,</p>
                    <p>Thank you for making a reservation with us. Here are the details of your reservation:</p>
                    <ul>
                        <li><strong>Reservation Name:</strong> ${result.name}</li>
                        <li><strong>Start Time:</strong> ${result.startTime}</li>
                        <li><strong>End Time:</strong> ${result.endTime}</li>
                    </ul>
                    <p>Please use the following password to access your reservation:</p>
                    <p><strong>Password: ${result.password}</strong></p>
                    <p>If you have any questions or need further assistance, feel free to contact us.</p>
                    <p>Best regards,</p>
                    <p>Your Company Name</p>
                </body>
            </html>`;
        await sendEmail(reservationData.user, subject, htmlContent);

        const currentHour = new Date();
        if(currentHour.getHours() == start.getHours()){
            if(workspace.deviceId) {
                await SetLedState(workspace.deviceId, { state: "unavailable" });
            }
        }

        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = CreateAbl;