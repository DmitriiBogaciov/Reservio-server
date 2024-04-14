const PlaceDao = require("../../../dao/place-dao");
const dao = new PlaceDao();

async function CheckPlaceAvailability(placeId, startTime, endTime) {
    try {
        const place = await dao.FindOne(placeId);

        // reservation start time
        const requestedStartTime = new Date(startTime);
        const requestedStartHour = requestedStartTime.getHours();

        // reservation end time
        const requestedEndTime = new Date(endTime);
        const requestedEndHour = requestedEndTime.getHours();

        // place opening and closing time
        const placeOpeningTime = convertTimeToMinutes(place.openingTime);
        const placeClosingTime = convertTimeToMinutes(place.closingTime);

        return (requestedStartHour >= placeOpeningTime && requestedEndHour <= placeClosingTime)

    } catch (error) {
        throw error;
    }

}

function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours;
}

module.exports = CheckPlaceAvailability;