const ResDeleteManyAbl = require("../reservation-abl/delete-many-abl")
const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

async function DeleteAbl(id) {
    try {

        const deletedReservations = await ResDeleteManyAbl({ workspace: id })

        const result = await dao.DeleteOne(id);
        
        return {
            deletedWorkspaces: result,
            deletedReservations: deletedReservations
        };
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteAbl;