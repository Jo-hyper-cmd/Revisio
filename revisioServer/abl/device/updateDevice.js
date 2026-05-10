const {updateDeviceSchema} = require("../../validationSchemas/deviceSchemas.js");
const daoDevice = require("../../dao/daoDevice.js");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();

addFormats(ajv);

async function updateDevice(req, res) {
    try {
        let device = req.body;
        let updatedDevice;

        const valid = ajv.validate(updateDeviceSchema, device);
        if (!valid) {
            res.status(400).json({
                code: "invalidInput",
                message: "Input data is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // check if device exists
        let existingDevice;
        try {
            existingDevice = daoDevice.get(device.id);
        } catch (error) {
            return res.status(400).json({ ...error });
        }
        if (!existingDevice) {
            return res.status(404).json({
                code: "deviceNotFound",
                message: `Device with id ${device.id} not found`,
            });
        }

        // yearOfManufacture must not be in the future
        if (device.yearOfManufacture) {
            const today = new Date().toISOString().split("T")[0];   // "YYYY-MM-DD"
            if (device.yearOfManufacture > today) {
                return res.status(400).json({
                    code: "yearOfManufactureInFuture",
                    message: `Year of manufacture (${device.yearOfManufacture}) cannot be in the future`,
                });
            }
        }

        // load all devices for uniqueness checks (excluding the device being updated)
        let allDevices;
        try {
            allDevices = daoDevice.list();
        } catch (error) {
            return res.status(400).json({ ...error });
        }
        const otherDevices = allDevices.filter(d => d.id !== device.id);

        // check if serialNumber is unique
        if (device.serialNumber) {
            const duplicateSerial = otherDevices.find(d => d.serialNumber === device.serialNumber);
            if (duplicateSerial) {
                return res.status(400).json({
                    code: "serialNumberAlreadyExists",
                    message: `Device with serialNumber '${device.serialNumber}' already exists`,
                    existingDeviceId: duplicateSerial.id,
                });
            }
        }

        // check if inventoryID is unique
        if (device.inventoryID) {
            const duplicateInventory = otherDevices.find(d => d.inventoryID === device.inventoryID);
            if (duplicateInventory) {
                return res.status(400).json({
                    code: "inventoryIDAlreadyExists",
                    message: `Device with inventoryID '${device.inventoryID}' already exists`,
                    existingDeviceId: duplicateInventory.id,
                });
            }
        }

        // update device in persistent storage
        try {
            updatedDevice = daoDevice.update(device);
        } catch (error) {
            res.status(400).json({
                ...error,
            });
            return;
        }

        res.json(updatedDevice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateDevice;