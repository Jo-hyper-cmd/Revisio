const { deleteDeviceSchema} = require("../../validationSchemas/deviceSchemas.js");
const daoDevice = require("../../dao/daoDevice.js");
const daoRevision = require("../../dao/daoRevision.js");


const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function deleteDevice(req, res) {
    try {
        let device = req.body;

        const validate = ajv.validate(deleteDeviceSchema, device);
        if (!validate) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "Input data is not valid",
                validationresults: ajv.errors,
            });
            return;
        }

        // Check if device exists
        let existingDevice;
        try {
            existingDevice = daoDevice.get(device.id);
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        if (!existingDevice) {
            return res.status(404).json({
                code: "deviceNotFound",
                message: `Device with id '${device.id}' not found`,
            });
        }

        //remove all revision with deviceId
        let deletedRevisionsCount = 0;
        try {
            const allRevisions = daoRevision.list();
            const deviceRevisions = allRevisions.filter(
                (revision) => revision.deviceId === device.id
            );

            for (const revision of deviceRevisions) {
                daoRevision.remove(revision.id);
                deletedRevisionsCount++;
            }
        } catch (error) {
            return res.status(500).json({
                code: "revisionDeletionFailed",
                message: "Failed to delete related revisions",
                error: error.message,
            });
        }

        //remove device

        try {
            device = daoDevice.remove(device.id);
            return res.status(200).json({
                code: "deviceDeleted",
                message: `Device has been deleted`,
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

module.exports = deleteDevice;
