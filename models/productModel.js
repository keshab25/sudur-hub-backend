import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type:String,
        trim:true,
        required:[true,"please filled a productName"],
    },

    description: {
        type:String,
        trim:true,
        required:[true,"please filled a description"],
    },
    category: {
        type:String,
        required:[true,"please filled a catagory"],
    },

    price: {
        type:Number,
        required:[true,"please filled a Number"],
    },

    productImg: {
        url: {
            type:String,
        },
    },
    ratings:{
        type: Number
    },
    manufacture:{
        type: String
    },

    isInstock: {
        type:Number,
        required:[true,"please filled a isInstock"],
    },

    createdAt: {
        type:String,
        default:Date.now(),
        
    },
    SKU: {
        type:String,
        
    },

});

const Product = new mongoose.model("product",productSchema);
export default Product;