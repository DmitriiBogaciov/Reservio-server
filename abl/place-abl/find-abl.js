const PlaceDao = require("../../dao/place-dao");
const dao = new PlaceDao();

async function FindAbl(filter, projection, options) {
    try {
        const places = await dao.Find(filter, projection, options);
        return places;
    } catch (error) {
        throw error;
    }
}

module.exports = FindAbl;