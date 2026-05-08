const {createRevisionSchema} = require("../../validationSchemas/revisionSchemas.js");
const daoRevision = require("../../dao/daoRevision");
const daoDevice = require("../../dao/daoDevice");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function createRevision(req, res) {
    try {
        let revision = req.body;

        const validate = ajv.validate(createRevisionSchema, revision);
        if (!validate) {
            res.status(400).json({
                code: "invalidInput",
                message: "Input data is not valid",
                error: ajv.errors,
            });
            return;
        }

        // check if revisionDate is not in future
        const revisionDate = new Date(revision.revisionDate);
        const now = new Date();
        if (revisionDate > now) {
            res.status(400).json({
                code: "revisionDateInFuture",
                message: "Revision date cannot be in the future",
            });
            return;
        }

        // check if revisionDate is in future
        const nextRevisionDate = new Date(revision.nextRevisionDate);
        if (nextRevisionDate <= now) {
            res.status(400).json({
                code: "nextRevisionDateNotInFuture",
                message: "Next revision date must be in the future",
            });
            return;
        }

        // nextRevisionDate must be bigger than revisionDate
        if (nextRevisionDate <= revisionDate) {
            res.status(400).json({
                code: "nextRevisionDateBeforeRevisionDate",
                message: "Next revision date must be after revision date",
            });
            return;
        }

        // check if device exists
        let device;
        try {
            device = daoDevice.get(revision.deviceId);
        } catch (error) {
            res.status(500).json({
                code: "deviceLookupFailed",
                message: "Failed to verify device existence",
                error: error.message,
            });
            return;
        }
        if (!device) {
            res.status(404).json({
                code: "deviceNotFound",
                message: `Device with id ${revision.deviceId} does not exist`,
            });
            return;
        }


        try {
            revision = daoRevision.create(revision);
        } catch (error) {
            res.status(400).json({ ...error });
            return;
        }

        res.json(revision);
    } catch (error) {
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
        res.status(500).json({ message: error.message });
    }
}

module.exports = createRevision;
