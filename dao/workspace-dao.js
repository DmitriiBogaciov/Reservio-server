const Workspace = require('./model/workspace-model');

class WorkspaceDao {
    async Create(data) {
        try {
            const result = await Workspace.create(data);
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

            const result = await Workspace.findByIdAndUpdate(id, data, options);
            return result;
        } catch (error) {
            throw error;
        }
    };

    async Find(filter, projection, options) {
        try {
            const result = await Workspace.find(filter, projection, options);
            if (result.length === 0) {
                const error = new Error("Didn't find any Workspace");
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
            const result = await Workspace.findById(id);
            if (!result) {
                const error = new Error("Workspace doesn't exist");
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
            const result = await Workspace.deleteOne(filter);
            if (!result) {
                const error = new Error("Can't delete Workspace");
                error.status = 404;
                throw error;
            }

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = WorkspaceDao;