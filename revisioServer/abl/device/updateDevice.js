const {updateDeviceSchema} = require("../../validationSchemas/deviceSchemas.js");
const daoDevice = require("../../dao/daoDevice.js");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function updateDevice(req, res) {
    try {
        let device = req.body;

        // validate input
        const valid = ajv.validate(updateDeviceSchema, device);
        if (!valid) {
            res.status(400).json({
                code: "invalidInput",
                message: "Input data is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // update device in persistent storage
        let updatedDevice;
        try {
            updatedDevice = daoDevice.update(device);
        } catch (error) {
            res.status(400).json({
                ...error,
            });
            return;
        }
        if (!updatedDevice) {
            res.status(404).json({
                code: "deviceNotFound",
                message: `Device with id ${device.id} not found`,
            });
            return;
        }

        // return properly filled dtoOut
        res.json(updatedDevice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateDevice;