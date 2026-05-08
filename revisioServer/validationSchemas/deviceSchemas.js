const createDeviceSchema = {
    type: "object",
    properties: {
        kind: { type: "string", enum: ["Spotrebič", "Predlžovací prívod"] },
        inventoryID: { type: "string", maxLength: 30 },
        name: { type: "string", maxLength: 150 },
        manufacturer: { type: "string", maxLength: 100 },
        type: { type: "string", maxLength: 100 },
        yearOfManufacture: { type: "string", format: "date" },
        serialNumber: { type: "string", maxLength: 30 },
        note: { type: "string", maxLength: 200 },
        nominalVoltage: { type: "number", minimum: 0 },
        nominalCurrent: { type: "number", minimum: 0 },
        nominalPower: { type: "number", minimum: 0 },
        cableType: { type: "string", enum: ["Oddeliteľný", "Neoddeliteľný"] },
        cableMaterial: { type: "string", maxLength: 20 },
        cableLength: { type: "number" },
        cableSection: { type: "string", maxLength: 20 },
        surgeProtection: { type: "boolean" },
        protectionClass: { type: "string", enum: ["I", "II", "III"] },
        usageGroup: { type: "string", enum: ["A", "B", "C", "D", "E"] },
        usageCategory: { type: "string", enum: ["V ruke", "Ostatné"] },
        mechanicalStrain: { type: "boolean" },
    },
    required: [
        "kind",
        "name",
        "manufacturer",
        "serialNumber",
        "nominalVoltage",
        "nominalCurrent",
        "nominalPower",
        "cableType",
        "cableLength",
        "protectionClass",
        "usageGroup",
        "mechanicalStrain",
    ],
    additionalProperties: false,
};

const getDeviceSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

const deleteDeviceSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

const updateDeviceSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        kind: { type: "string", enum: ["Spotrebič", "Predlžovací prívod"] },
        inventoryID: { type: "string", maxLength: 30 },
        name: { type: "string", maxLength: 150 },
        manufacturer: { type: "string", maxLength: 100 },
        type: { type: "string", maxLength: 100 },
        yearOfManufacture: { type: "string", format: "date" },
        serialNumber: { type: "string", maxLength: 30 },
        note: { type: "string", maxLength: 200 },
        nominalVoltage: { type: "number", minimum: 0 },
        nominalCurrent: { type: "number", minimum: 0 },
        nominalPower: { type: "number", minimum: 0 },
        cableType: { type: "string", enum: ["Oddeliteľný", "Neoddeliteľný"] },
        cableMaterial: { type: "string", maxLength: 20 },
        cableLength: { type: "number" },
        cableSection: { type: "string", maxLength: 20 },
        surgeProtection: { type: "boolean" },
        protectionClass: { type: "string", enum: ["I", "II", "III"] },
        usageGroup: { type: "string", enum: ["A", "B", "C", "D", "E"] },
        usageCategory: { type: "string", enum: ["V ruke", "Ostatné"] },
        mechanicalStrain: { type: "boolean" },
    },
    required: ["id"],
    additionalProperties: false,
};


module.exports = {
    createDeviceSchema,
    getDeviceSchema,
    deleteDeviceSchema,
    updateDeviceSchema
};