const express = require("express");
const router = express.Router();

const createDevice = require("../abl/device/createDevice");
const getDevice = require("../abl/device/getDevice");


router.post("/create", createDevice);
router.get("/get", getDevice);


module.exports = router;
