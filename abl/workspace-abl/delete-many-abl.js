const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

async function DeleteManyAbl(filter) {
    try {
        const result = await dao.DeleteMany(filter);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteManyAbl;