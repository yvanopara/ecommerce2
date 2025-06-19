import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: "ddumc0dvf",
    api_key: "762899855358646",
    api_secret: "9CCWNTCiIAOsIglNejDkqPHrm14"
  });
};

export default connectCloudinary;
