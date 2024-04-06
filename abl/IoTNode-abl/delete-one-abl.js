const WorkspaceUpadateManyAbl = require("../workspace-abl/update-many-abl");
const WorkspaceDao = require("../../dao/workspace-dao");
const wDao = new WorkspaceDao();
const IoTNodeDao = require("../../dao/IoTNode-dao");
const dao = new IoTNodeDao();


async function DeleteAbl(id) {
    try {

        const updatedIoTNodes = await WorkspaceUpadateManyAbl(
            { IoTNodeId: id },
            { $unset: { IoTNodeId: "" } }
        )

        const result = await dao.DeleteOne(id);

        return {
            deletedIoTNode: result,
            updatedWorkspaces: updatedIoTNodes
        };
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteAbl;