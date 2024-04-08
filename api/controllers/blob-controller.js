const express = require('express');
const Busboy = require('busboy');
const { BlobServiceClient } = require("@azure/storage-blob");

const get_response = require("../../utils/response-schema");

const router = express.Router();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

router.get("/listContainer", async (req, res) => {
    try {
        const containerList = [];
    let containers = blobServiceClient.listContainers();
    for await ( const container of containers ) {
        containerList.push(container.name);
    }
        res.send(get_response("Successful getting containers", 200, containerList))
    } catch (error){
        res.status(500).json(get_response("Error listing conteiners", 500, error.message));
    }
});

module.exports = router;