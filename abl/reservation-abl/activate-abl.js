const Ajv = require("ajv");
const mongoose = require('mongoose');
const addFormats = require("ajv-formats");
const ReservationSchema = require("../../api/validation-types/reservation-types");
const SetLedState = require("../IoTNode-abl/set-led-state-abl");
const Workspace = require("../../dao/model/workspace-model");
const ReservationDao = require('../../dao/reservation-dao');
const rDao = new ReservationDao();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(ReservationSchema.activateDtoInType)

async function ActivateAbl(password, workspaceIdString) {
    try {
        const valid = validate({ password: password, workspaceId: workspaceIdString });
        if (!valid) {
            const errorMessages = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error(`Validation failed: ${errorMessages}`);
            error.status = 400; // 400 Bad Request 
            throw error;
        }

        const res = await rDao.Find({ password: password });
        const reservation = {}
        if(res.length !== 0) {
            reservation = res[0]
        } else {
            const error = new Error("The reservation doesn't exist");
            error.status = 401; // Bad Request
            throw error;
        }
        
        
        const workspaceId = new mongoose.Types.ObjectId(workspaceIdString);
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
        ])

        const workspace = {};
        if (foundWorkspace.length !== 0) {
            const error = new Error("The workspace doesn't exist");
            error.status = 401; // Bad Request
            throw error;
        }

        console.log("Find:", workspace)

        if (workspace._id.toString() !== reservation.workspace.toString()) {
            const error = new Error("The workspace specified in the reservation does not correspond to this workspace.");
            error.status = 401; // Bad Request
            throw error;
        }

        if (reservation.active) {
            const error = new Error('The reservation is already active');
            error.status = 402; // Bad Request
            throw error;
        }

        const currentTime = new Date();

        if (currentTime < reservation.startTime || currentTime > reservation.endTime) {
            const error = new Error("The reservation cannot be activated at this time.");
            error.status = 403; // Bad Request
            throw error;
        }

        if(workspace.deviceId) {
            await SetLedState(workspace.deviceId, { state: "occupied" });
        }

        acticvate = {
            active: true
        }

        const result = await rDao.FindByIdAndUpdate({ _id: reservation._id }, acticvate);

        return result;

    } catch (error) {
        error.status = error.status || 500;
        throw error;
    }
}

module.exports = ActivateAbl;