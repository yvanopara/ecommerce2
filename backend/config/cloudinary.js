import { v2 as cloudinary } from "cloudinary";

/**
 * === Configuration du COMPTE PRINCIPAL (pour IMAGES) ===
 * Appelée au lancement du serveur
 */
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: "ddumc0dvf",         // TON COMPTE IMAGE
    api_key: "762899855358646",
    api_secret: "9CCWNTCiIAOsIglNejDkqPHrm14",
  });
};

export default connectCloudinary;

/**
 * === Configuration SECONDAIRE (pour VIDEOS) ===
 * Contient les infos de ton deuxième compte Cloudinary
 */
const cloudinaryVideos = {
  cloud_name: "dju6uqxky",  
     // TON COMPTE VIDEO
  api_key: "294828395788637",
  api_secret: "7vaVBa4gj5YyGoV6IqLTnww968A",
};
  console.log('dju6uqxky')   
/**
 * === Fonction pour uploader une VIDEO ===
 * ⚠️ Change la config Cloudinary pour le COMPTE VIDEO juste avant l'upload
 */
export const uploadVideo = async (filePath) => {
  // On bascule la config active sur le compte VIDEO :
  cloudinary.config({
    cloud_name: cloudinaryVideos.cloud_name,
    api_key: cloudinaryVideos.api_key,
    api_secret: cloudinaryVideos.api_secret,
  });

  // Puis on upload en précisant le type de ressource
  return await cloudinary.uploader.upload(filePath, {
    resource_type: "video",
  });
};

/**
 * === Fonction pour supprimer une VIDEO ===
 */
export const deleteVideo = async (publicId) => {
  // On configure aussi avec le compte vidéo avant suppression
  cloudinary.config({
    cloud_name: cloudinaryVideos.cloud_name,
    api_key: cloudinaryVideos.api_key,
    api_secret: cloudinaryVideos.api_secret,
  });

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
  });
};
