const express = require("express");
const router = express.Router();

const createDevice = require("../abl/device/createDevice");
const getDevice = require("../abl/device/getDevice");
const deleteDevice = require("../abl/device/deleteDevice");
const updateDevice = require("../abl/device/updateDevice");


router.post("/create", createDevice);
router.get("/get", getDevice);
router.post("/delete", deleteDevice);
router.post("/update", updateDevice);


module.exports = router;
