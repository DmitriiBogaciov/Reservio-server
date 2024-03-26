const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

async function DeleteAbl(id) {
    try {
        const result = await dao.DeleteOne(id);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteAbl;