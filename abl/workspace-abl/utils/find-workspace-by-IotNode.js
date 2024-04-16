const WorkspaceDao = require("../../../dao/workspace-dao");
const dao = new WorkspaceDao();
const IoTNodeDao = require("../../../dao/IoTNode-dao");
const IotDao = new IoTNodeDao();

async function FindWorkSpaceByIotNode(deviceId) {
    try {

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
                IoTNodeId: IotNode._id
            }
        )

        if(workspaces.length === 0){
            const error = new Error("Dind't find workspace");
            error.status = 400;
            throw error;
        }

        return workspaces[0];
    } catch (error) {
        throw error;
    }
}

module.exports = FindWorkSpaceByIotNode;