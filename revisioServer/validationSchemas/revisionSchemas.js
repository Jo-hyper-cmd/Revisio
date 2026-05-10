const createRevisionSchema = {
    type: "object",
    properties: {
        deviceId: { type: "string"},
        revisionDate: { type: "string", format: "date" },
        nextRevisionDate: { type: "string", format: "date" },
        insulationResistance: { type: "number", minimum: 0 },
        groundingResistance: { type: "number", minimum: 0 },
        leakingCurrent: { type: "number", minimum: 0 },
        runningTest: { type: "boolean"},
        visualTest: { type: "boolean"},
        revisionResult: { type: "boolean"},
        technicianName: { type: "string", maxLength: 150},
        technicianCertificate: { type: "string", maxLength: 150},
    },
    required: ["deviceId", "revisionDate","nextRevisionDate", "runningTest", "visualTest", "revisionResult", "technicianName", "technicianCertificate"],
    additionalProperties: false,
};

const getRevisionSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

const deleteRevisionSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

const updateRevisionSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        deviceId: { type: "string"},
        revisionDate: { type: "string", format: "date" },
        nextRevisionDate: { type: "string", format: "date" },
        insulationResistance: { type: "number", exclusiveMinimum: 0 },
        groundingResistance: { type: "number", minimum: 0 },
        leakingCurrent: { type: "number", minimum: 0 },
        runningTest: { type: "boolean"},
        visualTest: { type: "boolean"},
        revisionResult: { type: "boolean"},
        technicianName: { type: "string", maxLength: 150},
        technicianCertificate: { type: "string", maxLength: 150},
    },
    required: ["id"],
    additionalProperties: false,
};

const listRevisionSchema = {
    type: "object",
    properties: {
        deviceId: { type: "string" },
        status: { type: "string", enum: ["valid", "expiringSoon", "expired"] },
    },
    additionalProperties: false,
};

module.exports = {
    createRevisionSchema,
    getRevisionSchema,
    deleteRevisionSchema,
    updateRevisionSchema,
    listRevisionSchema
};