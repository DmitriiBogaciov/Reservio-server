const Place = require('./model/place-model');
require('dotenv').config();

class PlaceDao {
    async Create(data) {
        try {
            const result = await IoTNode.create(data);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // async UpdateOne(id, data) {
    //     try {
    //         const options = {
    //             returnDocument: "after"
    //         }

    //         const result = await Place.findByIdAndUpdate(id, data, options);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // async Find(filter, projection, options) {
    //     try {
    //         const result = await Place.find(filter, projection, options);
    //         if (result.length === 0) {
    //             const error = new Error("Didn't find any place");
    //             error.status = 404;
    //             throw error;
    //         }

    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // async FindOne(id) {
    //     try {
    //         const result = await Place.findById(id);
    //         if (!result) {
    //             const error = new Error("Place doesn't exist");
    //             error.status = 404;
    //             throw error;
    //         }
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // async DeleteOne(id) {
    //     try {
    //         const filter = {
    //             _id: id
    //         }
    //         const result = await Place.deleteOne(filter);
    //         if (!result) {
    //             const error = new Error("Can't delete place");
    //             error.status = 404;
    //             throw error;
    //         }

    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = PlaceDao;