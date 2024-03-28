const express = require("express");

const get_response = require('../../utils/response-schema');

const CreateAbl = require('../../abl/workspace-abl/create-abl');
const UpdateOneAbl = require('../../abl/workspace-abl/update-one-abl');
const FindAbl = require('../../abl/workspace-abl/find-abl');
const FindOneAbl = require('../../abl/workspace-abl/find-one-abl');
const DeleteOneAbl = require('../../abl/workspace-abl/delete-one-abl');

const router = express.Router();

router.post("/state", async (req, res, next) => {
  try {
    if(req.body.event == "call"){
        res.status(200).send(get_response("Call the receptionist", 200));
    } else if(req.body.event == "extend"){
        res.status(200).send(get_response("The reservation was extended", 200));
    }
  } catch (error) {
    next(error);
  } 
})

router.post("/create", async (req, res, next) => {
  try {
    const workspaceData = req.body;
    const newWorkspace = await CreateAbl(workspaceData)

    res.status(201).send(get_response("Workspace created", 201, newWorkspace))

  } catch (error) {
    next(error);
  } 
})

router.post("/updateOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedWorkspace = await UpdateOneAbl(id, updateData);

    res.status(200).send(get_response("Reservation updated", 200, updatedWorkspace));
  } catch (error) {
    next(error);
  }
})

router.get("/findAll", async (req, res, next) => {
  try {
    const filter = req.body.filter;
    const options = req.body.options;
    const projection = req.body.projection;

    const workspaces = await FindAbl(filter, projection, options);

    res.status(200).send(get_response("Workspaces received", 200, workspaces));
  } catch (error) {
    next(error);
  }
})

router.get("/findOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const workspace = await FindOneAbl(id);

    res.status(200).send(get_response("Workspace received", 200, workspace));
  } catch (error) {
    next(error);
  }
})

router.delete("/deleteOne/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await DeleteOneAbl(id);

    res.status(200).send(get_response("Workspace deleted", 200, result));
  } catch (error) {
    next(error);
  }
})



module.exports = router;
