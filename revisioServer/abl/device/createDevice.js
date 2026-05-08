const {createDeviceSchema} = require("../../validationSchemas/deviceSchemas.js");
const daoDevice = require("../../dao/daoDevice.js");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function createDevice(req, res) {
    try {
        let device = req.body;

        const validate = ajv.validate(createDeviceSchema, device);
        if (!validate) {
            res.status(400).json({
                code: "invalidInput",
                message: "Input data is not valid",
                validationresults: ajv.errors,
            });
            return;
        }
        try {
            device = daoDevice.create(device);
        } catch (error) {
            res.status(400).json({ ...error });
            return;
        }

        res.json(device);
    } catch (error) {
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
        res.status(500).json({ message: error.message });
    }
}

module.exports = createDevice;
