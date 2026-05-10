const { getRevisionSchema } = require("../../validationSchemas/revisionSchemas.js");

const Ajv = require("ajv");
const ajv = new Ajv();
const daoRevision = require("../../dao/daoRevision.js");

async function getRevision(req, res) {
    try {
        const reqParams = req.query?.id ? req.query : req.body;

        const valid = ajv.validate(getRevisionSchema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "InputData is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const revision = daoRevision.get(reqParams.id);
        if (!revision) {
            res.status(404).json({
                code: "revisionNotFound",
                message: `Revision with id ${reqParams.id} not found`,
            });
            return;
        }

        // return outputData
        res.json(revision);
    } catch (error) {
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
        res.status(500).json({ message: error.message });
    }
}

module.exports = getRevision;
