import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: false,
        default: 1234
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },

}, {
    timestamps: true
})


export default mongoose.model('User', userSchema)