import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:"CLOUDINARY_API_SECRET"

})

// 
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)return null;
        // upload the file on cloudinay 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file has been uploaded succesfull
        // console.log('file is uploaded on cloudinary ',response.url)
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove the locally saved memory 
        // saved temp file as the uplaod operatin got failed 
        return null;

        
    }
    
}
export {uploadOnCloudinary}


