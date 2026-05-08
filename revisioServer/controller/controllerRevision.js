const express = require("express");
const router = express.Router();

const createRevision = require("../abl/revision/createRevision");
const getRevision = require("../abl/revision/getRevision");


router.post("/create", createRevision);
router.get("/get", getRevision);

module.exports = router;
