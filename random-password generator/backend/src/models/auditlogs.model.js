import mongoose from "mongoose"

const auditSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    action: {
        type: String,
        required: true
    },

    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },

    details: {
        type: Object
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AuditLog=mongoose.model("AuditLog",auditSchema)
export default AuditLog