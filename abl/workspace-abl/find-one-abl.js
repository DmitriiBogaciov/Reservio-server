const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

async function FindOneAbl(id) {
    try {
        const workspace = await dao.FindOne(id);
        return workspace;
    } catch (error) {
        throw error;
    }
}

module.exports = FindOneAbl;