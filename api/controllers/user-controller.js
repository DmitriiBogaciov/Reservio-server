const express = require('express');
const getUserInfo = require("../../utils/get-user-info")
const jwtCheck = require('../../utils/jwt-config');
const get_response = require('../../utils/response-schema');

const router = express.Router();

router.get("/getInfo", jwtCheck, async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const userInfo = await getUserInfo(accessToken);
    return res.status(200).send(get_response("User info fetched", 200, userInfo));
  } catch (error) {
    next(error);
  }
});

// router.post("/updateUser", (req, res)), {

// }

module.exports = router;