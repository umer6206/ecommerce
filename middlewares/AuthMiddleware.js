import Jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
    try {
        const decode = Jwt.verify(req.headers.authorization, process.env.JWT_KEY);
        req.user = decode
        next()
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "Authentication failed"
        })
    }
}

export const isAdminMidlleware = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(200).send({
                success: false,
                message: "unAuthorize access: access denied"
            })
        } else {
            next()
        }
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "Errors in admin middleware"
        })
    }
}