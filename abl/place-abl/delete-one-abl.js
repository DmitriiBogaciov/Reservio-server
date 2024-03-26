const PlaceDao = require("../../dao/place-dao");
const dao = new PlaceDao();

async function DeleteAbl(id) {
    try {
        const result = await dao.DeleteOne(id);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = DeleteAbl;