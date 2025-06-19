import productModel from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Add product item

 const addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, sizes, price, bestseller } = req.body;

    let parsedSizes = [];

    // Si des tailles sont fournies, essayer de les parser
    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
        if (!Array.isArray(parsedSizes)) throw new Error();
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Format des tailles invalide. Envoyez un JSON.' });
      }

      // Valider chaque taille
      for (const s of parsedSizes) {
        if (!s.size || isNaN(parseFloat(s.price))) {
          return res.status(400).json({ success: false, message: 'Chaque taille doit avoir une taille et un prix valide.' });
        }
      }
    }

    // Si AUCUNE taille fournie, un prix est obligatoire
    if (parsedSizes.length === 0) {
      if (price === undefined || isNaN(parseFloat(price))) {
        return res.status(400).json({ success: false, message: 'Un prix est requis si aucune taille n\'est fournie.' });
      }
    }

    // Traitement des images (image1 à image8)
    const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8'];
    const images = imageFields
      .map(field => req.files?.[field]?.[0])
      .filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    const product = new productModel({
      name,
      description,
      category,
      subCategory,
      bestseller: bestseller === 'true',
      sizes: parsedSizes,
      price: parsedSizes.length === 0 ? price : undefined,
      image: imagesUrl,
      date: Date.now(),
    });

    await product.save();

    res.status(201).json({ success: true, message: 'Produit ajouté avec succès', product });

  } catch (error) {
    console.error('Erreur dans addProduct:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'ajout du produit.' });
  }
};



// Liste de tous les produits
const listProduct = async (req, res) => {
  try {
    const product = await productModel.find({});
    res.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
  }
};

// Suppression de produit
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.json({ success: false, message: 'Product not deleted' });
  }
};

// Récupération d’un produit
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
