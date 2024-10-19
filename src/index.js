// require ('dotenv').config({path:'./env'}) // create inconsistency 
import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express  from 'express'
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
    })
   
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!! ",err)
})


































// function connectDB (){} // declaration 
// first appraoh
// connectDB()// excute 

// now follow the good apprach  if iss 
/*
const app = express();

;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
       app.on("error",()=>{
        console.log("error");
        throw error;
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App is listing on port ${process.env.PORT}`)
       })
        
    } catch (error) {
        console.log(error);
        throw error;
        
    }


})()
    */
