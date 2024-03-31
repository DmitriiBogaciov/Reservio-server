const WorkspaceDao = require("../../dao/workspace-dao");
const wDao = new WorkspaceDao();

async function Update00() {

    try {
        const workspaces = await wDao.Find({ IoTNodeId : { $exists: true, $ne: null }});

        
    } catch (error) {
        
    }
}

module.exports = Update00;