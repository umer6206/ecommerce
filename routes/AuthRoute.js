import express from "express"
import { isAdminMidlleware, requireSignIn } from "../middlewares/AuthMiddleware.js"
import { AuthLoginCtrl, AuthRegisterCtrl, forgetPasswordCtrl, getAllOrdersController, getOrderCtrl, orderStatusController } from "../controllers/AuthController.js"

//router object

const router = express.Router()

//Register route || method Post

router.post("/register", AuthRegisterCtrl)

//LOgin route
router.post("/login", AuthLoginCtrl)

//forget password

router.post("/forget-password", forgetPasswordCtrl)

//check authenticated user
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})
//check authenticated admin
router.get("/admin-auth", requireSignIn, isAdminMidlleware, (req, res) => {
    res.status(200).send({ ok: true })
})
//all orders
router.get("/all-orders", requireSignIn, isAdminMidlleware, getAllOrdersController);

// order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdminMidlleware,
    orderStatusController
);

//user Route
router.get("/order", requireSignIn, getOrderCtrl)
export default router