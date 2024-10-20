import mongoose ,{Schema}from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

// 1 user schema 
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true  // make searching easy accross the internet
    },
    email:{
        type :String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,

    },
    fullName:{
        type :String,
        required:true,
        trim:true,
        index:true
     

    },
    avartar:{
        type :String, // we will cloudinary url 
        required:true,
    },
    coverImage:{
        typr:String // cloudinary url 

    },
    // is the array cause store multiple value 
      
    watchHistory:[ 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ] ,
    password:{ 
        type :String, 
        required:[true,'Password is required'] // we can give custom message

    },
    refreshToken:{
        type:String
    }





},{timestamps:true})

userSchema.pre("save",async function(next){ // why async cause we have to wait 
    if(!this.isModified("password"))return next(); // dont use arrow fucntion 
    this.password= await bcrypt.hash(this.password,10)
    next()
})

// caparision 
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)

}
// jwt token access
userSchema.methods.generateAccessToken  = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
// jwt refress token 
userSchema.methods.generateAccessToken  = function(){
    return jwt.sign({
        _id:this._id,
        

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefrestToken = function(){}


export const User = mongoose.model("User",userSchema)
