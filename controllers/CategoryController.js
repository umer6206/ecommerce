import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";


export const CreateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.send({ message: "Name is required" })
        }
        const existingCategory = await CategoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: "Category already exist"
            })
        }
        const newCategory = await new CategoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "New Category created successfully",
            newCategory
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Errors is Create category"
        })
    }
}

export const GetAllCategory = async (req, res) => {
    try {
        const AllCategory = await CategoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Fetched All Category successsfully",
            AllCategory
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Errors while fetching Category"
        })
    }
}
export const GetSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const SingleCategory = await CategoryModel.findById(id);
        res.status(200).send({
            success: true,
            message: "Fetched Category successsfully",
            SingleCategory
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Errors while fetching Single Category"
        })
    }
}
export const UpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body
        const UpdatedCategory = await CategoryModel.findByIdAndUpdate(
            id, { name, slug: slugify(name) }, { new: true });
        res.status(200).send({
            success: true,
            message: "Updated Category successsfully",
            UpdatedCategory
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Errors while Updating Category"
        })
    }
}
export const DeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const DeletedCategory = await CategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Deleted Category successsfully",
            DeletedCategory
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Errors while Deleting Category"
        })
    }
}