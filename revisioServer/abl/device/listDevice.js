const { listDeviceSchema } = require("../../validationSchemas/deviceSchemas.js");
const daoDevice = require("../../dao/daoDevice.js");

const Ajv = require("ajv");
const ajv = new Ajv();

async function listDevice(req, res) {
    try {
        const params = Object.keys(req.query).length > 0 ? req.query : req.body || {};

        // validate inputData
        const valid = ajv.validate(listDeviceSchema, params);
        if (!valid) {
            res.status(400).json({
                code: "inputDataIsNotValid",
                message: "InputData is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // load all devices from persistent storage
        let devices;
        try {
            devices = daoDevice.list();
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        // apply filters
        if (params.kind) {
            devices = devices.filter(d => d.kind === params.kind);
        }
        if (params.usageGroup) {
            devices = devices.filter(d => d.usageGroup === params.usageGroup);
        }
        if (params.protectionClass) {
            devices = devices.filter(d => d.protectionClass === params.protectionClass);
        }
        if (params.usageCategory) {
            devices = devices.filter(d => d.usageCategory === params.usageCategory);
        }

        // return outputData
        res.json({
            deviceList: devices,
            count: devices.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = listDevice;