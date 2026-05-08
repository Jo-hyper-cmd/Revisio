const express = require("express");
const router = express.Router();

const createDevice = require("../abl/device/createDevice");


router.post("/create", createDevice);


module.exports = router;
