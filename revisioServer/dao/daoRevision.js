const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const deviceFolderPath = path.join(__dirname, "storage", "revisionList");

function create(revision) {
    try {
        if (!fs.existsSync(deviceFolderPath)) {
            fs.mkdirSync(deviceFolderPath, { recursive: true });
        }

        revision.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(deviceFolderPath, `${revision.id}.json`);
        const fileData = JSON.stringify(revision);
        fs.writeFileSync(filePath, fileData, "utf8");
        return revision;
    } catch (error) {
        throw { code: "failedToCreateDevice", message: error.message };
    }
}

module.exports = {
    create,
};