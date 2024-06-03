import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        console.log('localFilePath on cloundinary: ', localFilePath);
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        console.log('file cloundinary res: ', response);
        // fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        // remove the saved locally file as the file upload operation got failed!
        return null;
    }
}

export {uploadOnCloudinary}

// (async function(){
//      // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUD_NAME, 
//         api_key: process.env.CLOUD_API_KEY, 
//         api_secret: process.env.CLOUD_API_SECRET // Click 'View Credentials' below to copy your API secret
//     });
// })()