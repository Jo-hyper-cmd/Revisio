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
                code: "inputDataIsNotValid",
                message: "Input data is not valid",
                validationresults: ajv.errors,
            });
            return;
        }

        //yearOfManufacture must not be in future
        if (device.yearOfManufacture) {
            const today = new Date().toISOString().split("T")[0];   // "YYYY-MM-DD"
            if (device.yearOfManufacture > today) {
                return res.status(400).json({
                    code: "yearOfManufactureInFuture",
                    message: `Year of manufacture (${device.yearOfManufacture}) cannot be in the future`,
                });
            }
        }

        //check if serialNumber is unique
        let allDevices;
        try {
            allDevices = daoDevice.list();
        } catch (error) {
            return res.status(400).json({ ...error });
        }

        const duplicateSerial = allDevices.find(d => d.serialNumber === device.serialNumber);
        if (duplicateSerial) {
            return res.status(400).json({
                code: "serialNumberAlreadyExists",
                message: `Device with serialNumber '${device.serialNumber}' already exists`,
                existingDeviceId: duplicateSerial.id,
            });
        }

        //check if inventoryID is unique
        if (device.inventoryID) {
            const duplicateInventory = allDevices.find(d => d.inventoryID === device.inventoryID);
            if (duplicateInventory) {
                return res.status(400).json({
                    code: "inventoryIDAlreadyExists",
                    message: `Device with inventoryID '${device.inventoryID}' already exists`,
                    existingDeviceId: duplicateInventory.id,
                });
            }
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
