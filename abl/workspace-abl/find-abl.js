const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

async function FindAbl(filter, projection, options) {
    try {
        const workspaces = await dao.Find(filter, projection, options);
        return workspaces;
    } catch (error) {
        throw error;
    }
}

module.exports = FindAbl;