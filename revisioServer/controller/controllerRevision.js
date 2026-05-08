const express = require("express");
const router = express.Router();

const createRevision = require("../abl/revision/createRevision");
const getRevision = require("../abl/revision/getRevision");
const deleteRevision = require("../abl/revision/deleteRevision");
const listRevision = require("../abl/revision/listRevision");



router.post("/create", createRevision);
router.get("/get", getRevision);
router.post("/delete", deleteRevision);
router.get("/list", listRevision);

module.exports = router;
