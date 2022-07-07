// const mongoose = require("mongoose")
import mongoose from "mongoose"

const orderSchema = mongoose.Schema({
    id_product: String,
    id_user: String,
    jumlah: Number,
    harga: Number,
    status: String,
    created: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Order', orderSchema)