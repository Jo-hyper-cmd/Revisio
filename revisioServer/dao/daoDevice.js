const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const deviceFolderPath = path.join(__dirname, "storage", "deviceList");

function create(device) {
    try {
        if (!fs.existsSync(deviceFolderPath)) {
            fs.mkdirSync(deviceFolderPath, { recursive: true });
        }

        device.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(deviceFolderPath, `${device.id}.json`);
        const fileData = JSON.stringify(device);
        fs.writeFileSync(filePath, fileData, "utf8");
        return device;
    } catch (error) {
        throw { code: "failedToCreateDevice", message: error.message };
    }
}

function get(deviceId) {
    try {
        const filePath = path.join(deviceFolderPath, `${deviceId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadDevice", message: error.message };
    }
}

function remove(deviceId) {
    try {
        const filePath = path.join(deviceFolderPath, `${deviceId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }
        throw { code: "failedToRemoveDevice", message: error.message };
    }
}

function update(device) {
    try {
        const currentDevice = get(device.id);
        if (!currentDevice) return null;

        const newDevice = { ...currentDevice, ...device };
        const filePath = path.join(deviceFolderPath, `${device.id}.json`);
        const fileData = JSON.stringify(newDevice);
        fs.writeFileSync(filePath, fileData, "utf8");
        return newDevice;
    } catch (error) {
        throw { code: "failedToUpdateDevice", message: error.message };
    }
}

function list() {
    try {
        const files = fs.readdirSync(deviceFolderPath);
        const deviceList = files.map((file) => {
            const fileData = fs.readFileSync(
                path.join(deviceFolderPath, file),
                "utf8"
            );
            return JSON.parse(fileData);
        });
        return deviceList;
    } catch (error) {
        throw { code: "failedToListDevices", message: error.message };
    }
}


module.exports = {
    create,
    get,
    remove,
    update,
    list
};
