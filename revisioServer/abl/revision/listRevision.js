const daoRevision = require("../../dao/daoRevision.js");

async function listRevision(req, res) {
    try {
        const revisionList = daoRevision.list();
        res.json({ revisionList: revisionList, count: revisionList.length, });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = listRevision;