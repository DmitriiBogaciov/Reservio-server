const express = require("express");

const SetLedState = require("../../abl/IoTNode-abl/set-led-state-abl")

const router = express.Router();

router.post("/set/state", async (req, res, next) => {
  try {
    const result = SetLedState("Workspace1", req.body);

    return result;
  } catch (error) {
    next(error);
  } 
});

module.exports = router;