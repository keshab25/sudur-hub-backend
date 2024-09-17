import express from "express";
import { allProducts, createProduct, updateProduct,deleteProduct, singleProduct, allProductsAdmin, adminSingleProduct } from "../controllers/productController.js";
import upload from "../file/upload.js";
import { isAuthAdmin, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

//create product
router.post("/create/product",isAuthenticated,isAuthAdmin,upload.single("productImg"), createProduct);
//all products
router.get("/all/products",allProducts);

//single product
router.get("/single/product/:id",singleProduct);
//update products
router.put("/update/product/:id",isAuthenticated,isAuthAdmin,upload.single("productImg"), updateProduct);
//delete product
router.delete("/delete/product/:id",isAuthenticated,isAuthAdmin,deleteProduct);


//for admin route
router.route("/admin/all/products").get(isAuthenticated, isAuthAdmin, allProductsAdmin);
//get single admin product
router.route("/admin/single/product/:id").get(isAuthenticated, isAuthAdmin, adminSingleProduct);

export default router;
