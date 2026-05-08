const { getDeviceSchema } = require("../../validationSchemas/deviceSchemas.js");

const Ajv = require("ajv");
const ajv = new Ajv();
const daoDevice = require("../../dao/daoDevice.js");

async function getDevice(req, res) {
    try {
        const reqParams = req.query?.id ? req.query : req.body;

        const valid = ajv.validate(getDeviceSchema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const device = daoDevice.get(reqParams.id);
        if (!device) {
            res.status(404).json({
                code: "deviceNotFound",
                message: `Device with id ${reqParams.id} not found`,
            });
            return;
        }

        // return properly filled dtoOut
        res.json(device);
    } catch (error) {
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
        res.status(500).json({ message: error.message });
    }
}

module.exports = getDevice;
