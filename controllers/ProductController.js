import slugify from "slugify"
import ProductModel from "../models/ProductModel.js"
import OrderModel from "../models/OrderModel.js"
import fs from 'fs'
import braintree from "braintree"
import dotenv from "dotenv"
dotenv.config()

export const CreateProduct = async (req, res) => {
    try {
        const { name, slug, description, shipping, price, category, quantity } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(500).send({ message: "Name is required" })
            case !description:
                return res.status(500).send({ message: "description is required" })
            case !price:
                return res.status(500).send({ message: "price is required" })
            case !category:
                return res.status(500).send({ message: "category is required" })
            case !quantity:
                return res.status(500).send({ message: "quantity is required" })
            case !photo && photo.size > 1000000:
                return res.status(500).send({ message: "photo is required and size must be less than 1 MB" })
        }
        const product = new ProductModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.ContentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success: true,
            message: "Product added successfully",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Somthing went wrong during creating product"
        })
    }
}
export const GetAllProduct = async (req, res) => {
    try {
        const product = await ProductModel.find({}).select("-photo").limit(12).sort({ createdAt: -1 }).populate("category")
        res.status(200).send({
            success: true,
            message: "Get all the products",
            countTotal: product.length,
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Somthing went wrong during fetching all product"
        })
    }
}
export const GetSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await ProductModel.findById(id).limit(12).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: "Get single the products",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Somthing went wrong during fetching single product"
        })
    }
}
export const getProductPhoto = async (req, res) => {
    try {
        const { id } = req.params
        const product = await ProductModel.findById(id).select("photo")
        if (product.photo.data) {
            res.set("Content-Type", product.photo.ContentType)
            res.status(200).send(product.photo.data)
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Somthing went wrong during fetchin product's photo"
        })
    }
}
export const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        await ProductModel.findByIdAndDelete(id).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Somthing went wrong during deleting product"
        })
    }
}
export const UpdateProduct = async (req, res) => {
    try {
        const { name, description, shipping, price, category, quantity } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(500).send({ message: "Name is required" })
            case !description:
                return res.status(500).send({ message: "description is required" })
            case !price:
                return res.status(500).send({ message: "price is required" })
            case !category:
                return res.status(500).send({ message: "category is required" })
            case !quantity:
                return res.status(500).send({ message: "quantity is required" })
            case !photo && photo.size > 1000000:
                return res.status(500).send({ message: "photo is required and size must be less than 1 MB" })
        }
        const product = await ProductModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.ContentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success: true,
            message: "Product Updated successfully",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Somthing went wrong during Updating product"
        })
    }
}

export const filterProductCtrl = async (req, res) => {
    try {
        const { checked, priceRadio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (priceRadio.length) args.price = { $gte: priceRadio[0], $lte: priceRadio[1] }
        const product = await ProductModel.find(args)
        res.status(200).send({
            success: true,
            message: "Filter successfully",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while filtering product"
        })
    }
}

//============> payment section ==============>
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_ID,
    privateKey: process.env.BRAINTREE_PRIVATE_ID,
});
export const braintreeTokenCtrl = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, resp) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(resp)
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wrong",
            error,
        });
    }
}
export const braintreePaymentCtrl = async (req, res) => {
    try {
        const { card, nonce } = req.body
        let total = 0
        card.map((i) => {
            total = total + i.price
        })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            },
        }, function (err, resp) {
            if (resp) {
                const order = new OrderModel({
                    products: card,
                    payment: resp,
                    buyer: req.user._id
                }).save()
                res.json({ ok: true })
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wrong",
            error,
        });
    }
}