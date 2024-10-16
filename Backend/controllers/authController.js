import userModel from "../models/userModel.js"
import { hashPassword, comparePassword } from "../helper/authHelper.js"
import jwt from 'jsonwebtoken'

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).send({ success: false, message: 'Please fill in all fields' })
        }
        const user = await userModel
            .findOne({ email })
        if (user) {
            return res.status(400).send({ success: false, message: 'User already exists' })
        }
        const newUser = new userModel({
            name,
            email,
            password: await hashPassword(password),
            phone,
            address
        })
        await newUser.save()
        res.status(201).send({ success: true, message: 'User created successfully', newUser })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Server Error', error })
    }
}
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Please fill in all fields!!' })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({ success: false, message: 'No user found!!' })
        }
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ success: false, message: 'Invalid creds!!' })
        }
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).send({
            success: true, message: 'Login successful', token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Server Error', error })
    }
}
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        if (!email || !otp || !newPassword) {
            res.status(400).send({ success: false, message: 'Please fill in all fields' })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(404).send({ success: false, message: 'No user found' })
        }
        if (user.otp !== otp) {
            res.status(400).send({ success: false, message: 'Invalid OTP' })
        }
        else {
            const hashP = await hashPassword(newPassword)
            await userModel.findByIdAndUpdate(user._id, { password: hashP }, { new: true })
            res.status(200).send({ success: true, message: 'Password reset successful' })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Server Error', error })

    }
}
