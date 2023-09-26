import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref: "category",
        required: true
    },
    photo: {
        data: Buffer,
        ContentType: String
    },
    shipping: {
        type: String
    }
}, { timestamps: true })
export default mongoose.model("products", ProductSchema)