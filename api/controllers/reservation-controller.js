const express = require("express");

const get_response = require('../../utils/response-schema');
const getUserInfo = require('../../utils/get-user-info');
const jwtCheck = require('../../utils/jwt-config');
const checkScope = require('../../utils/check-scope');

const CreateAbl = require('../../abl/reservation-abl/create-abl');
const ActivateAbl = require('../../abl/reservation-abl/activate-abl');
const UpdateOneAbl = require('../../abl/reservation-abl/update-one-abl');
const FindAbl = require('../../abl/reservation-abl/find-abl');
const FindOneAbl = require('../../abl/reservation-abl/find-one-abl');
const DeleteOneAbl = require('../../abl/reservation-abl/delete-one-abl');
const ExtendAbl = require("../../abl/reservation-abl/extend-abl");
const ExtendByPassAbl = require("../../abl/reservation-abl/extend-by-pass-abl")
const Notify = require("../../abl/reservation-abl/notification-of-completion");

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

router.post("/create", async (req, res, next) => {
  try {
    // const accessToken = req.headers.authorization.split(" ")[1];
    // const user = await getUserInfo(accessToken);
    const reservationData = req.body;

    const newReservation = await CreateAbl(reservationData);

    res.status(201).send(get_response("Reservation created", 201, newReservation));
  } catch (error) {
    next(error);
  }
})

router.post("/activate/", async (req, res, next) => {
  try {
    const data = req.body;
    const result = await ActivateAbl(data.password, data.workspace);
    
    res.status(200).send(get_response("Reservation actiovated successfully", 200, result));
  } catch (error) {
    next(error);
  }
})

router.post("/updateOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedReservation = await UpdateOneAbl(id, updateData);

    res.status(200).send(get_response("Reservation updated", 200, updatedReservation));
  } catch (error) {
    next(error);
  }
})

router.post("/findAll", async (req, res, next) => {
  try {
    const filter = req.body.filter;
    const options = req.body.options;
    const projection = req.body.projection;

    const reservations = await FindAbl(filter, projection, options);

    res.status(200).send(get_response("Reservations received", 200, reservations));
  } catch (error) {
    next(error);
  }
})

router.get("/findOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const reservation = await FindOneAbl(id);

    res.status(200).send(get_response("Reservation received", 200, reservation));
  } catch (error) {
    next(error);
  }
})

router.delete("/deleteOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await DeleteOneAbl(id);

    res.status(200).send(get_response("Reservation deleted", 200, result));
  } catch (error) {
    next(error);
  }
})

router.post("/extendByPass", async (req, res, next) => {
  console.log('POST /extendByPass route hit');
  try {
    const user = req.body.user;
    const password = req.body.password
    const result = await ExtendByPassAbl(user, password);

    res.status(200).send(get_response("Reservation extended", 200, result));
  } catch (error) {
    next(error);
  }
})

router.post("/extend/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ExtendAbl(id);

    res.status(200).send(get_response("Reservation extended", 200, result));
  } catch (error) {
    next(error);
  }
})

router.post("/notify", async (req, res, next) => {
  try {
    const result = await Notify();

    res.status(200).send(get_response("Notified", 200, result));
  } catch (error) {
    next(error);
  }
})



module.exports = router;
