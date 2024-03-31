const express = require("express");

const get_response = require('../../utils/response-schema');

const SetLedState = require("../../abl/IoTNode-abl/set-led-state-abl");
const CreateAbl = require("../../abl/IoTNode-abl/create-abl");
const FindAbl = require("../../abl/IoTNode-abl/find-abl")

const router = express.Router();

// test function
router.post("/set/state", async (req, res, next) => {
  try {
    const result = await SetLedState("Workspace1", req.body);

    res.status(200).send(get_response("IoTNode status updated", 201, result))
  } catch (error) {
    next(error);
  } 
});

router.post("/create", async (req, res, next) => {
  try {
    const IoTNodeData = req.body;

    const newIoTNode = await CreateAbl(IoTNodeData);

    res.status(201).send(get_response("IoTNode created", 201, newIoTNode))

  } catch (error) {
    next(error);
  } 
});

router.get("/find", async (req, res, next) => {
  try {
    const filter = req.body.filter;
    const options = req.body.options;
    const projection = req.body.projection;

    const IoTNodes = await FindAbl(filter, projection, options);

    res.status(200).send(get_response("IoTNodes received", 200, IoTNodes));
  } catch (error) {
    next(error);
  }
})

module.exports = router;