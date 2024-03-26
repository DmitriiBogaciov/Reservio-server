const express = require("express");

const getUserInfo = require('../../utils/get-user-info');
const get_response = require('../../utils/response-schema');
const jwtCheck = require('../../utils/jwt-config');
const checkScope = require('../../utils/check-scope');

const CreateAbl = require('../../abl/place-abl/create-abl');
const UpdateOneAbl = require('../../abl/place-abl/update-one-abl');
const FindAbl = require('../../abl/place-abl/find-abl');
const FindOneAbl = require('../../abl/place-abl/find-one-abl');
const DeleteOneAbl = require('../../abl/place-abl/delete-one-abl');

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

router.post("/updateOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedPlace = await UpdateOneAbl(id, updateData);

    res.status(200).send(get_response("Reservation updated", 200, updatedPlace));
  } catch (error) {
    next(error);
  }
})

router.get("/findAll", async (req, res, next) => {
  try {
    const filter = req.body.filter;
    const options = req.body.options;
    const projection = req.body.projection;

    const places = await FindAbl(filter, projection, options);

    res.status(200).send(get_response("Reservations received", 200, places));
  } catch (error) {
    next(error);
  }
})

router.get("/findOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const place = await FindOneAbl(id);

    res.status(200).send(get_response("Reservation received", 200, place));
  } catch (error) {
    next(error);
  }
})

router.delete("/deleteOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await DeleteOneAbl(id);

    res.status(200).send(get_response("Place deleted", 200, result));
  } catch (error) {
    next(error);
  }
})

module.exports = router;