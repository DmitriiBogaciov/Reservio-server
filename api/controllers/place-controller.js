const express = require("express");

const getUserInfo = require('../../utils/get-user-info');
const get_response = require('../../utils/response-schema');
const jwtCheck = require('../../utils/jwt-config');
const checkScope = require('../../utils/check-scope');

const CreateAbl = require('../../abl/place-abl/create-abl');

const router = express.Router();

router.post("/create", jwtCheck, checkScope('place:create'), async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const user = await getUserInfo(accessToken);
    const placeData = req.body;

    const newPlace = await CreateAbl(placeData, user.sub)

    res.status(201).send(get_response("Place created", 201, newPlace))

  } catch (error) {
    next(error);
  } 
})

module.exports = router;