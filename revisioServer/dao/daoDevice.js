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


module.exports = {
    create,
};
