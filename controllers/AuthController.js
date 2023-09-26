import { comparePassword, hashPassword } from "../helpers/AuthHelper.js";
import userModel from "../models/userModel.js"
import OrderModel from "../models/OrderModel.js"
import Jwt from "jsonwebtoken";
export const AuthRegisterCtrl = async (req, res) => {
    try {
        const { name, email, phone, address, password, answer } = req.body;
        if (!name) {
            return res.send({ error: "name is required" })
        }
        if (!email) {
            return res.send({ error: "email is required" })
        }
        if (!phone) {
            return res.send({ error: "phone no is required" })
        }
        if (!address) {
            return res.send({ error: "address is required" })
        }
        if (!answer) {
            return res.send({ error: "address is required" })
        }
        if (!password) {
            return res.send({ error: "password is required" })
        }

        //check existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Registered please login"
            })
        }
        //new user register
        const hashedPassword = await hashPassword(password);
        const user = new userModel({ name, email, phone, address, answer, password: hashedPassword });
        await user.save()
        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user
        })
    } catch (error) {
        res.status(500).send({
            success: true,
            message: "Errors in user registration",
            error
        })
    }
}

export const AuthLoginCtrl = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.send({
                success: false,
                message: "Email or Password is required"
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(201).send({
                success: false,
                message: "Invalid Email or password"
            })
        }
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid Email or password"
            })
        }
        const token = await Jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "2d" })
        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while login",
            error
        })
    }
}

export const forgetPasswordCtrl = async (req, res) => {
    try {
        const { email, password, answer } = req.body
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            res.status(200).send({
                success: false,
                message: "Invalid email or answer"
            })
        }
        const hashedPassword = await hashPassword(password)
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword })
        res.status(200).send({
            success: true,
            message: "Reset password successfully",
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wrong during forget Password"
        })
    }
}

export const getOrderCtrl = async (req, res) => {
    try {
        const order = await OrderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(order)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While getting Order",
            error,
        });
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await OrderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};