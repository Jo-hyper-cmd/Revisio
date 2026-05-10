const { listRevisionSchema } = require("../../validationSchemas/revisionSchemas.js");
const daoRevision = require("../../dao/daoRevision.js");

const Ajv = require("ajv");
const ajv = new Ajv();

const EXPIRING_SOON_DAYS = 30;

function getRevisionStatus(revision, now) {
    const nextDate = new Date(revision.nextRevisionDate);

    // calculate the threshold date for "expiring soon"
    const soonThreshold = new Date(now);
    soonThreshold.setDate(soonThreshold.getDate() + EXPIRING_SOON_DAYS);

    if (nextDate < now) {
        return "expired";
    }
    if (nextDate <= soonThreshold) {
        return "expiringSoon";
    }
    return "valid";
}

async function listRevision(req, res) {
    try {
        const params = Object.keys(req.query).length > 0 ? req.query : req.body || {};

        const valid = ajv.validate(listRevisionSchema, params);
        if (!valid) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "InputData is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // load all revisions from persistent storage
        let revisions;
        try {
            revisions = daoRevision.list();
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        // filter by deviceId
        if (params.deviceId) {
            revisions = revisions.filter(r => r.deviceId === params.deviceId);
        }

        // compute status for each revision and filter by status
        const now = new Date();
        const enrichedRevisions = revisions.map(r => ({
            ...r,
            status: getRevisionStatus(r, now),
        }));

        let filteredRevisions = enrichedRevisions;
        if (params.status) {
            filteredRevisions = enrichedRevisions.filter(r => r.status === params.status);
        }

        // return outputData
        res.json({
            revisionList: filteredRevisions,
            count: filteredRevisions.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = listRevision;