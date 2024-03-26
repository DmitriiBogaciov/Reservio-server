const PlaceDao = require("../../dao/place-dao");
const dao = new PlaceDao();

async function FindOneAbl(id) {
    try {
        const place = await dao.FindOne(id);
        return place;
    } catch (error) {
        throw error;
    }
}

module.exports = FindOneAbl;