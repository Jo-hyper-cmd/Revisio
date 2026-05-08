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

function get(revisionId) {
    try {
        const filePath = path.join(deviceFolderPath, `${revisionId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadDevice", message: error.message };
    }
}

module.exports = {
    create,
    get
};