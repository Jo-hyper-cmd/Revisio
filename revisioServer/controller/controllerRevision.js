const express = require("express");
const router = express.Router();

const createRevision = require("../abl/revision/createRevision");

router.post("/create", createRevision);

module.exports = router;
