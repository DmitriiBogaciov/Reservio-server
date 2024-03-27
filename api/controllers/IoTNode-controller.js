const express = require("express");

const SetLedState = require("../../abl/IoTNode-abl/set-led-state-abl")

const router = express.Router();

// test function
router.post("/set/state", async (req, res, next) => {
  try {
    const result = SetLedState("Workspace1", req.body);

    return result;
  } catch (error) {
    next(error);
  } 
});

router.post("/create", async (req, res, next) => {
  try {
    const placeData = req.body;

    const newIoTNode = await CreateAbl(IoTNodeData)

    res.status(201).send(get_response("IoTNode created", 201, newIoTNode))

  } catch (error) {
    next(error);
  } 
})

module.exports = router;