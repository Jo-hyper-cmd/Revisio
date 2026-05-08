const createDeviceSchema = {
    type: "object",
    properties: {
        kind: { type: "string", enum: ["Spotrebič", "Predlžovací prívod"] },
        inventoryID: { type: "string" },
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
        cableSection: { type: "number" },
        surgeProtection: { type: "boolean" },
        protectionClass: { type: "string", enum: ["I", "II", "III"] },
        usageGroup: { type: "string", enum: ["A", "B", "C", "D", "E"] },
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


module.exports = {
    createDeviceSchema,
};