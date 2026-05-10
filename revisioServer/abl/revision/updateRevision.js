const { updateRevisionSchema } = require("../../validationSchemas/revisionSchemas.js");
const daoRevision = require("../../dao/daoRevision.js");
const daoDevice = require("../../dao/daoDevice.js");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function updateRevision(req, res) {
    try {
        let revision = req.body;

        const valid = ajv.validate(updateRevisionSchema, revision);
        if (!valid) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "InputData is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // check if revision exists
        let existingRevision;
        try {
            existingRevision = daoRevision.get(revision.id);
        } catch (error) {
            return res.status(400).json({ ...error });
        }
        if (!existingRevision) {
            return res.status(404).json({
                code: "revisionNotFound",
                message: `Revision with id ${revision.id} not found`,
            });
        }

        // revisionDate must not be in the future (only if being updated)
        const now = new Date();
        let revisionDate;
        if (revision.revisionDate) {
            revisionDate = new Date(revision.revisionDate);
            if (revisionDate > now) {
                return res.status(400).json({
                    code: "revisionDateInFuture",
                    message: "Revision date must be current day or a day in the past",
                });
            }
        } else {
            revisionDate = new Date(existingRevision.revisionDate);
        }

        // nextRevisionDate must be in the future (only if being updated)
        let nextRevisionDate;
        if (revision.nextRevisionDate) {
            nextRevisionDate = new Date(revision.nextRevisionDate);
            if (nextRevisionDate <= now) {
                return res.status(400).json({
                    code: "nextRevisionDateNotInFuture",
                    message: "Next revision date must be a day in the future",
                });
            }
        } else {
            nextRevisionDate = new Date(existingRevision.nextRevisionDate);
        }

        // nextRevisionDate must be after revisionDate
        if (nextRevisionDate <= revisionDate) {
            return res.status(400).json({
                code: "nextRevisionDateBeforeRevisionDate",
                message: "Next revision date must be after revision date",
            });
        }

        // revisionResult cannot be true when runningTest or visualTest failed
        const finalRunningTest = revision.runningTest !== undefined ? revision.runningTest : existingRevision.runningTest;
        const finalVisualTest = revision.visualTest !== undefined ? revision.visualTest : existingRevision.visualTest;
        const finalRevisionResult = revision.revisionResult !== undefined ? revision.revisionResult : existingRevision.revisionResult;

        if (finalRevisionResult === true && (finalRunningTest === false || finalVisualTest === false)) {
            return res.status(400).json({
                code: "inconsistentRevisionResult",
                message: "Revision result cannot be true when runningTest or visualTest failed",
            });
        }

        // check if new deviceId exists (only if being updated)
        if (revision.deviceId && revision.deviceId !== existingRevision.deviceId) {
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
        }

        // update revision in persistent storage
        let updatedRevision;
        try {
            updatedRevision = daoRevision.update(revision);
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        res.json(updatedRevision);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateRevision;