const { createRevisionSchema } = require("../../validationSchemas/revisionSchemas.js");
const daoRevision = require("../../dao/daoRevision");
const daoDevice = require("../../dao/daoDevice");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function createRevision(req, res) {
    try {
        let revision = req.body;

        const valid = ajv.validate(createRevisionSchema, revision);
        if (!valid) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "InputData is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // revisionDate must not be in the future
        const revisionDate = new Date(revision.revisionDate);
        const now = new Date();
        if (revisionDate > now) {
            return res.status(400).json({
                code: "revisionDateInFuture",
                message: "Revision date must be current day or a day in the past",
            });
        }

        // nextRevisionDate must be in the future
        const nextRevisionDate = new Date(revision.nextRevisionDate);
        if (nextRevisionDate <= now) {
            return res.status(400).json({
                code: "nextRevisionDateNotInFuture",
                message: "Next revision date must be a day in the future",
            });
        }

        // nextRevisionDate must be after revisionDate
        if (nextRevisionDate <= revisionDate) {
            return res.status(400).json({
                code: "nextRevisionDateBeforeRevisionDate",
                message: "Next revision date must be a day in the future",
            });
        }

        // revisionResult cannot be true when runningTest or visualTest failed
        if (revision.revisionResult === true &&
            (revision.runningTest === false || revision.visualTest === false)) {
            return res.status(400).json({
                code: "inconsistentRevisionResult",
                message: "Revision result cannot be true when runningTest or visualTest failed",
            });
        }

        // check if device exists
        let device;
        try {
            device = daoDevice.get(revision.deviceId);
        } catch (error) {
            return res.status(400).json({ ...error });
        }
        if (!device) {
            return res.status(404).json({
                code: "deviceDoesNotExist",
                message: `Device with id ${revision.deviceId} does not exist`,
            });
        }

        // create revision in persistent storage
        try {
            revision = daoRevision.create(revision);
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        // return outputData
        res.json(revision);
    } catch (error) {
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
        res.status(500).json({ message: error.message });
    }
}

module.exports = createRevision;