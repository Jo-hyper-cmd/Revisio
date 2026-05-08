const daoDevice = require("../../dao/daoDevice.js");

async function listDevice(req, res) {
    try {
        const deviceList = daoDevice.list();
        res.json({ deviceList: deviceList, count: deviceList.length, });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = listDevice;