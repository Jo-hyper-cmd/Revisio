const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const revisionFolderPath = path.join(__dirname, "storage", "revisionList");

function create(revision) {
    try {
        if (!fs.existsSync(revisionFolderPath)) {
            fs.mkdirSync(revisionFolderPath, { recursive: true });
        }

        revision.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(revisionFolderPath, `${revision.id}.json`);
        const fileData = JSON.stringify(revision);
        fs.writeFileSync(filePath, fileData, "utf8");
        return revision;
    } catch (error) {
        throw { code: "failedToCreateRevision", message: error.message };
    }
}

function get(revisionId) {
    try {
        const filePath = path.join(revisionFolderPath, `${revisionId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadRevision", message: error.message };
    }
}

function remove(revisionId) {
    try {
        const filePath = path.join(revisionFolderPath, `${revisionId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }
        throw { code: "failedToRemoveRevision", message: error.message };
    }
}

function update(revision) {
    try {
        const currentRevision = get(revision.id);
        if (!currentRevision) return null;

        const newRevision = { ...currentRevision, ...revision };
        const filePath = path.join(revisionFolderPath, `${revision.id}.json`);
        const fileData = JSON.stringify(newRevision);
        fs.writeFileSync(filePath, fileData, "utf8");
        return newRevision;
    } catch (error) {
        throw { code: "failedToUpdateRevision", message: error.message };
    }
}

function list() {
    try {
        const files = fs.readdirSync(revisionFolderPath);
        const revisionList = files.map((file) => {
            const fileData = fs.readFileSync(
                path.join(revisionFolderPath, file),
                "utf8"
            );
            return JSON.parse(fileData);
        });
        return revisionList;
    } catch (error) {
        throw { code: "failedToListRevisions", message: error.message };
    }
}

module.exports = {
    create,
    get,
    remove,
    update,
    list
};