const { deleteRevisionSchema} = require("../../validationSchemas/revisionSchemas.js");
const daoRevision = require("../../dao/daoRevision.js");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function deleteRevision(req, res) {
    try {
        let revision = req.body;

        const validate = ajv.validate(deleteRevisionSchema, revision);
        if (!validate) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "InputData is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // Check if revision exists
        let existingRevision;
        try {
            existingRevision = daoRevision.get(revision.id);
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        if (!existingRevision) {
            return res.status(404).json({
                code: "revisionNotFound",
                message: `Revision with id '${revision.id}' not found`,
            });
        }

        //remove revision

        try {
            revision = daoRevision.remove(revision.id);
            return res.status(200).json({
                code: "revisionDeleted",
                message: `Revision has been deleted`,
            });
        } catch (error) {
            res.status(400).json({ ...error });
            return;
        }

    } catch (error) {
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
        res.status(500).json({ error: error.message });
    }
}

module.exports = deleteRevision;
