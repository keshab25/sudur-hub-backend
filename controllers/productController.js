import Product from "../models/productModel.js";
import path from "path";
import { join } from "path";
import fs from "fs";
import { unlink } from "fs/promises";
import { tryCatchAsyncError } from "../middlewares/tryCatchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiFeatures from "../helpers/apiFeatures.js";

//create product
export const createProduct = tryCatchAsyncError(async (req, res, next) => {
  const {
    productName,
    description,
    category,
    price,
    ratings,
    manufacture,
    isInstock,
    SKU,
  } = req.body;

  if (
    !productName ||
    !description ||
    !category ||
    !price ||
    !ratings ||
    !isInstock ||
    !manufacture ||
    !SKU
  ) {
    if (req.file) {
      await unlink(req.file.path);
    }
    return next(new ErrorHandler("field must be filled"));
  }

  const baseUrl = `${req.protocol}://${req.hostname}:${
    process.env.PORT || 4000
  }`;
  const imagePath = req.file.filename;
  let productImageUrl;

  if (imagePath) {
    productImageUrl = `${baseUrl}/gallery/${imagePath}`.replace(/\\/g,"/")
  }
  const product = await Product.create({
    productName,
    description,
    category,
    price,
    ratings,
    manufacture,
    isInstock,
    SKU,
    productImg: productImageUrl ? { url: productImageUrl } : undefined,
  });

  res.status(201).json({
    success: true,
    message: "product create successafully",
    product,
  });
});

//get all products
export const allProducts = tryCatchAsyncError(async (req, res, next) => {
  const resultPerPage = 12;
  const countDocument = await Product.countDocuments()
  const apiFeature = new ApiFeatures(Product.find(),req.query)
  .search()
  .filter()
  .pagination(resultPerPage)
  const products = await apiFeature.query;
  if(!products) return next(new ErrorHandler("products not found!",404))

  res.status(200).json({
    success: true,
    message: "products get successfully",
    data:products,
    resultPerPage,
    countDocument,
    
  });
});
//get single product
export const singleProduct = tryCatchAsyncError(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) return next(new ErrorHandler("product not found"));

  res.status(200).json({
    success: true,
    message: "product get successfully!",
    data:product,
  });
});

//update  product
export const updateProduct = tryCatchAsyncError(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);
  if (!product) {
    if (req.file) {
      await unlink(req.file.path);
    }
    return next(new ErrorHandler("product not found"));
  }

  const {
    productName,
    description,
    category,
    price,
    ratings,
    manufacture,
    isInstock,
    SKU,
  } = req.body;
  if (
    !productName ||
    !description ||
    !category ||
    !price ||
    !isInstock ||
    !ratings ||
    !manufacture ||
    !SKU
  ) {
    if (req.file) {
      await unlink(req.file.path);
    }
    return next(new ErrorHandler("please provide all fields"));
  }
  const existingImageUrl = product.productImg.url;
  const baseUrl = `${req.protocol}://${req.hostname}:${
    process.env.PORT || 4000
  }`;
  const imagePath = req.file.filename;
  let productImageUrl;

  if (existingImageUrl) {
    const filename = path.basename(existingImageUrl);
    const previousPath = path.join("public","gallery",filename)
    fs.unlinkSync(previousPath);
  }
  if (imagePath) {
    productImageUrl = `${baseUrl}/gallery/${imagePath}`.replace(/\\/g,"/")
  }
  product.productName = productName;
  product.description = description;
  product.category = category;
  product.price = price;
  product.ratings = ratings;
  product.manufacture = manufacture;
  product.isInstock = isInstock;
  product.SKU = SKU;
  product.productImg = productImageUrl ? { url: productImageUrl } : undefined;

  await product.save();
  res.status(200).json({
    success: true,
    message: "product update sucecssfully!",
    product,
  });
});

//delete products
export const deleteProduct = tryCatchAsyncError(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) return next(new ErrorHandler("product not found"));

  const existingImageUrl = product?.productImg.url;
  if (existingImageUrl) {
    const filename = path.basename(existingImageUrl);
    const previousPath = path.join("public","gallery",filename);
    fs.unlinkSync(previousPath);
  }

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "product delete successfully!",
  });
});

//get all products by admin(only)
export const allProductsAdmin = tryCatchAsyncError(async(req,res,next)=>{
  const products = await Product.find();

  if(!products) return next(new ErrorHandler("products not found",404));

    return res.status(200).json({
      success: true,
      message: "all product fetch successfully!",
      data: products,
    });

})


//get single admin product
export const adminSingleProduct = tryCatchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.params.id)
  if(!product) return next(new ErrorHandler("product not found",404))
  return res.status(200).json({
success: true,
message:"product get successfully",
data: product,
})
})