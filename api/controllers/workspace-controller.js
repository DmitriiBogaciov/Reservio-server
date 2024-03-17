const express = require("express");

const get_response = require('../../utils/response-schema');

const router = express.Router();

router.post("/state", async (req, res, next) => {
  try {
    if(req.body.state == 1){
        res.status(200).send(get_response("Call the receptionist", 200));
    } else if(req.body.state == 2){
        res.status(200).send(get_response("The reservation wass extended", 200));
    }
  } catch (error) {
    next(error);
  } 
})



module.exports = router;
