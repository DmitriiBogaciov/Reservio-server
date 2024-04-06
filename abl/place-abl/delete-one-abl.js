const ResDeleteManyAbl = require("../reservation-abl/delete-many-abl");
const WorkDeleteManyAbl = require("../workspace-abl/delete-many-abl")
const PlaceDao = require("../../dao/place-dao");
const WorkspaceDao = require("../../dao/workspace-dao");
const dao = new PlaceDao();
const wDao = new WorkspaceDao();

async function DeleteAbl(id) {
    let deletedWorkspaces = [];
    let deletedReservations = [];

    try {
        // Find workspaces related to the place
        let relatedWorkspaces;
        try {
            relatedWorkspaces = await wDao.Find({ placeId: id });
        } catch (error) {
            if (error.status === 404) {
                relatedWorkspaces = [];
            } else {
                throw error;
            }
        }

        // If related workspaces are found
        if (relatedWorkspaces.length > 0) {
            const relatedWorkspacesIds = relatedWorkspaces.map(workspace => workspace._id);

            // Delete related reservations
            deletedReservations = await ResDeleteManyAbl({ workspace: { $in: relatedWorkspacesIds } });

            // Delete related workspaces
            deletedWorkspaces = await WorkDeleteManyAbl({ _id: { $in: relatedWorkspacesIds } });
        }

        // Delete the place itself
        const deletedPlace = await dao.DeleteOne(id);

        return {
            deletedPlace,
            deletedWorkspaces,
            deletedReservations
        };

    } catch (error) {
        console.error("Error in DeleteAbl:", error);
        throw error;
    }
}

module.exports = DeleteAbl;