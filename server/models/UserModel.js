import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    alamat: String,
    role: String,
    refresh_token: String,
    created: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('User', userSchema)