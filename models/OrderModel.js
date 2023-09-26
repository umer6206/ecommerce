import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: "products"
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "users"
    },
    status: {
        type: String,
        default: "not process",
        enum: ["not process", "processing", "shipped", "delivered", "cancel"]
    }
}, { timestamps: true })

export default mongoose.model("orders", OrderSchema)