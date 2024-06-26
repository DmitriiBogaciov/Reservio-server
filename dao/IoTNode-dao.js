const IoTNode = require('./model/IoTNode-model');

class PlaceDao {
    async Create(data) {
        try {
            const result = await IoTNode.create(data);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async FindByIdAndUpdate(id, data) {
        try {
            const options = {
                returnDocument: "after"
            }

            const result = await IoTNode.findByIdAndUpdate(id, data, options);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async Find(filter, projection, options) {
        try {
            const result = await IoTNode.find(filter, projection, options);
            if (result.length === 0) {
                const error = new Error("Didn't find any IoTNode");
                error.status = 404;
                throw error;
            }

            return result;
        } catch (error) {
            throw error;
        }
    };

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

    async DeleteOne(id) {
        try {
            const result = await IoTNode.findByIdAndDelete(id);
            if (!result) {
                const error = new Error("IoTNode not found");
                error.status = 404;
                throw error;
            }

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PlaceDao;