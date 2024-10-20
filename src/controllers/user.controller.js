import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.model.js"
import{uploadOncloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { application, response } from "express"
// async is higher order function 

const generateAccessAndRefreshTokens = async(userId)=>{
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken  = refreshToken
      await user.save({validateBeforeSave:false});

      return {accessToken,refreshToken}


      
   } catch (error) {
      throw new ApiError (500,"Something went wrong while generating refresh and access token ")
      
   }

}



const registerUser = asyncHandler(async (req,res)=>{
   // get user details from frontend 
   // validation  not empty 
   // check if user already exists :username , email
   // check for images , chcek for avatar 
   // upload then to cloudinary , avatar
   // create user object - create entry in db 
   // remove password and refresh token field form response 
   // check for user creation 
   //return res
 
   // this is for data handling
   const{fullName, email,username,password}= req.body
   console.log("email:",email);// get consoled using postman 
   if(
      [fullName,email,username,password].some((field)=>(field?.trim()===""))
   ){
      throw new ApiError(400,"All fields are required")
   }

   const existedUser = await User.findOne({
      $or:[{username},{email}]
   })

   if(existedUser){
      throw new ApiError(409,"User with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath  = req.files?.coverImage[0]?.path;
   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is required")
   }

  const avatar  = await uploadOncloudinary(avatarLocalPath)
  const coverImage = await uploadOncloudinary(coverImageLocalPath)

  if(!avatar){
   throw new ApiError(400,"Avatar file is required")
  }

 const user =  await User.create({
   fullName,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()

  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser)
   {
      throw new ApiError(500,"something went wrong while registration the user")
   }

   return res.status(201).json(
      new ApiResponse(200,createdUser,"user registred succesful ")
   )






  
})

const loginUser = asyncHandler(async (req,res)=>{
  /* req body ->data
   uesrname or email
     find the user 
     password check
     access and refrese token 
     send cookie 
     response 
      */
     const {email,username,password} = req.body
     if(!username || !email){
      throw new ApiError (400,"username or email is required")

     }
     const user = await User.findOne({ // User are from model 
      $or :[{username},{email}] // either userName or email
     })

     if(!user){
      throw new ApiError (404,"User does not exits")
     }

     const isPasswardValid = await user.isPasswordCorrect(password)
     if(!isPasswardValid){
      throw new ApiError (404,"Wrong password")
     }

     const {accessToken,refreshToken}=await 
     generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).
     select("-password -refreshToken")

// cookeys?

     const options = {
      httpOnly:true,
      secure:true // modifiable by server 
     }

     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refeshToken",refreshToken,options)
     .json(  // why json 
      new ApiResponse(
         200,
         {
            user:loggedInUser,accessToken,refreshToken


         },
         "user login succesfully "
         

      )
     )


     
   


})


// logout 
const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{refeshToken:undefined}

      },
      {
          new :true
      }
   )
   const options = {
      httpOnly:true,
      secure:true // modifiable by server 
     }
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logout"))



})



// route cretion 
export {
   registerUser,
   loginUser,
   logoutUser
}








