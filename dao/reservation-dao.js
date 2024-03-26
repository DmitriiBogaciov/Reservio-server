const Reservation = require('./model/reservation-model');
require('dotenv').config();

class ReservationDao {
    async Create(data) {
        try {
            const result = await Reservation.create(data);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async UpdateOne(id, data) {
        try {
            const options = {
                returnDocument: "after"
            }

            const result = await Reservation.findByIdAndUpdate(id, data, options);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async FindOne(id) {
        try {
            const result = await Reservation.findById(id);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async Find(filter, projection, options) {
        try {
            const result = await Reservation.find(filter, projection, options);
            if (result.length === 0) {
                const error = new Error("Didn't find any reservation");
                error.status = 404;
                throw error;
            }

            return result;
        } catch (error) {
            throw error;
        }
    };

    async FindOne(id) {
        try {
            const result = await Reservation.findById(id);
            if (!result) {
                const error = new Error("Reservation doesn't exist");
                error.status = 404;
                throw error;
            }
            return result;
        } catch (error) {
            throw error;
        }
    };

    async DeleteOne(id) {
        try {
            const filter = {
                _id: id
            }
            const result = await Reservation.deleteOne(filter);
            if (!result) {
                const error = new Error("Can't delete reservation");
                error.status = 404;
                throw error;
            }

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ReservationDao;