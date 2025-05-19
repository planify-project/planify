import axios from "axios";
import { PRESET, USER_NAME } from "../configs/cloudinary";
// Uploads an image file to Cloudinary and returns the secure URL
export const uploadToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", `${PRESET}`); // Replace with your Cloudinary upload preset

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${USER_NAME}/image/upload`, // Replace with your Cloudinary cloud name
    formData
  );
  return response.data.secure_url;
};