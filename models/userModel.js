import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: [true, "please filled a fullName"],
  },
  avatar:{
    url:{
        type:String
    }

  },

  mobileNo: {
    type: Number,
    unique: [true, "mobileNo already exists!"],
    required: [true, "please filled a mobileNo"],
  },
  email: {
    type: String,
    unique: [true, "email already exists!"],
    required: [true, "please filled a email"],
  },
  password: {
    type: String,
    required: [true, "please filled a password"],
    select:false
  },
  role:{
    type:String,
    enum:["admin","user","seller","buyer"],
    default:"user",
  },
  verified:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

//hashed password
userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)

})
//generate token

userSchema.methods.getJwtToken = function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:"2h",
  });
}
//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

const User = new mongoose.model("user",userSchema)
export default User;