const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new WorkspaceDao();

async function UpdateManyAbl(filter, data){
    try {
        result = await dao.UpdateMany(filter, data)

        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = UpdateManyAbl;