// const mongoose = require("mongoose")
import mongoose from "mongoose"

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    image: String,
    url: String,
    price: String,
    stock: Number,
    category: String,
    created: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Product', productSchema)