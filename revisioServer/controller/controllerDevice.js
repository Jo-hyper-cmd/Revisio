const express = require("express");
const router = express.Router();

const createDevice = require("../abl/device/createDevice");
const getDevice = require("../abl/device/getDevice");
const deleteDevice = require("../abl/device/deleteDevice");


router.post("/create", createDevice);
router.get("/get", getDevice);
router.post("/delete", deleteDevice);


module.exports = router;
