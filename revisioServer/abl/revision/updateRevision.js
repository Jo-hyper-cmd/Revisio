const {updateRevisionSchema} = require("../../validationSchemas/revisionSchemas.js");
const daoRevision = require("../../dao/daoRevision.js");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function updateRevision(req, res) {
    try {
        let revision = req.body;

        // validate input
        const valid = ajv.validate(updateRevisionSchema, revision);
        if (!valid) {
            res.status(400).json({
                code: "invalidInput",
                message: "Input data is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // update revision in persistent storage
        let updatedRevision;
        try {
            updatedRevision = daoRevision.update(revision);
        } catch (error) {
            res.status(400).json({
                ...error,
            });
            return;
        }
        if (!updatedRevision) {
            res.status(404).json({
                code: "deviceNotFound",
                message: `Revision with id ${revision.id} not found`,
            });
            return;
        }

        // return properly filled dtoOut
        res.json(updatedRevision);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateRevision;