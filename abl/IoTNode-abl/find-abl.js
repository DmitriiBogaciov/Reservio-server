const IoTNodeDao = require("../../dao/IoTNode-dao");
const dao = new IoTNodeDao();

async function FindAbl(filter, projection, options) {
    try {
        const IoTNodes = await dao.Find(filter, projection, options);
        return IoTNodes;
    } catch (error) {
        throw error;
    }
}

module.exports = FindAbl;