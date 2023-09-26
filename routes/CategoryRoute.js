import express from "express"
import { isAdminMidlleware, requireSignIn } from "../middlewares/AuthMiddleware.js"
import { CreateCategory, DeleteCategory, GetAllCategory, GetSingleCategory, UpdateCategory } from "../controllers/CategoryController.js"
const router = express.Router()

//create category route
router.post("/add-category", requireSignIn, isAdminMidlleware, CreateCategory)
//Get All category
router.get("/getAll-category", GetAllCategory);
//Get Single category
router.get("/getSingle-category/:id", GetSingleCategory);
//Update category
router.put("/update-category/:id", requireSignIn, isAdminMidlleware, UpdateCategory);
//Update category
router.post("/delete-category/:id", requireSignIn, isAdminMidlleware, DeleteCategory);

export default router