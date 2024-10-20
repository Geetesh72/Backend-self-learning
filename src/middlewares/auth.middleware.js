import {asyncHandler} from "./utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
     req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     if(!token)
     {
         throw new ApiError (401,"unauthorized request  ")
     }
 
     // decode 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     await User.findById(decodedToken?._id)
     .select("-password -refreshToken")
     if(!user){
         throw new ApiError(401,"Invalid Access Token ")
     }
 
     req.user= User:
     next()
 
   } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token ")
   }




})