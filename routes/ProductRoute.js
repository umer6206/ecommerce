import express from "express"
import { isAdminMidlleware, requireSignIn } from "../middlewares/AuthMiddleware.js"
import { CreateProduct, DeleteProduct, GetAllProduct, GetSingleProduct, UpdateProduct, braintreePaymentCtrl, braintreeTokenCtrl, filterProductCtrl, getProductPhoto } from "../controllers/ProductController.js"
import formidable from "express-formidable"
//objects
const router = express.Router()

//create product
router.post("/add-product", requireSignIn, isAdminMidlleware, formidable(), CreateProduct)
//Update product
router.put("/update-product/:id", requireSignIn, isAdminMidlleware, formidable(), UpdateProduct)

//get all product
router.get('/getAll-product', GetAllProduct)

//get single product
router.get("/getSingle-product/:id", GetSingleProduct)

//getProduct photo
router.get("/getPhoto/:id", getProductPhoto)

//delete product
router.delete("/delete-product/:id", requireSignIn, isAdminMidlleware, DeleteProduct)
//filter product route
router.post("/product-filter", filterProductCtrl)

//payment==============
//token
router.get("/braintree/token", braintreeTokenCtrl)
//payment
router.post("/braintree/payment", requireSignIn, braintreePaymentCtrl)

export default router