import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";



// ADD PRODUCT
const addProduct = async (req, res) => {

  try {

    const {
      name,
      description,
      details,
      utilisation,
      category,
      subCategory,
      sizes,
      price,
      bestseller
    } = req.body;

    let parsedSizes = [];

    if (sizes) {

      try {

        parsedSizes =
          JSON.parse(sizes);

        if (
          !Array.isArray(
            parsedSizes
          )
        ) throw new Error();

      } catch (err) {

        return res.status(400).json({
          success: false,
          message:
            "Format des tailles invalide."
        });
      }

      for (const s of parsedSizes) {

        if (
          !s.size ||
          isNaN(
            parseFloat(
              s.price
            )
          )
        ) {

          return res.status(400).json({
            success: false,
            message:
              "Chaque taille doit avoir une taille et un prix valide."
          });
        }
      }
    }

    if (
      parsedSizes.length === 0
    ) {

      if (
        price === undefined ||
        isNaN(
          parseFloat(price)
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Un prix est requis si aucune taille n'est fournie."
        });
      }
    }

    const imageFields = [
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
      "image7",
      "image8"
    ];

    const images =
      imageFields
        .map(
          field =>
            req.files?.[
              field
            ]?.[0]
        )
        .filter(Boolean);

    const imagesUrl =
      await Promise.all(

        images.map(
          async (img) => {

            const result =
              await cloudinary.uploader.upload(
                img.path,
                {
                  resource_type:
                    "image"
                }
              );

            return result.secure_url;
          }
        )
      );

    const product =
      new productModel({

        name,

        description,

        details,

        utilisation,

        category,

        subCategory,

        bestseller:
          bestseller ===
          "true",

        sizes:
          parsedSizes,

        price:
          parsedSizes.length === 0
            ? price
            : undefined,

        image:
          imagesUrl,

        date:
          Date.now()
      });

    await product.save();

    res.status(201).json({

      success: true,

      message:
        "Produit ajouté avec succès",

      product
    });

  } catch (error) {

    console.error(
      "Erreur dans addProduct:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Erreur serveur lors de l'ajout du produit."
    });
  }
};


// UPDATE PRODUCT
// UPDATE PRODUCT
const updateProduct = async (req, res) => {

  try {

    const {
      id,
      name,
      description,
      details,
      utilisation,
      category,
      subCategory,
      sizes,
      price,
      bestseller
    } = req.body;

    if (!id) {

      return res.json({
        success: false,
        message: "ID produit manquant"
      });
    }

    const product =
      await productModel.findById(id);

    if (!product) {

      return res.json({
        success: false,
        message: "Produit introuvable"
      });
    }

    let parsedSizes = [];

    if (sizes) {

      parsedSizes =
        typeof sizes === "string"
          ? JSON.parse(sizes)
          : sizes;
    }

    const imageFields = [
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
      "image7",
      "image8"
    ];

    let updatedImages =
      req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : [...product.image];

    for (let i = 0; i < imageFields.length; i++) {

      const file =
        req.files?.[
          imageFields[i]
        ]?.[0];

      if (file) {

        const result =
          await cloudinary.uploader.upload(
            file.path,
            {
              resource_type: "image"
            }
          );

        updatedImages[i] =
          result.secure_url;
      }
    }

    // Supprime les images null
    updatedImages =
      updatedImages.filter(Boolean);

    const updatedProduct =
      await productModel.findByIdAndUpdate(

        id,

        {
          name,
          description,
          details,
          utilisation,

          category:
            category || product.category,

          subCategory:
            subCategory || product.subCategory,

          sizes:
            parsedSizes.length > 0
              ? parsedSizes
              : product.sizes,

          price:
            price || product.price,

          image:
            updatedImages,

          bestseller:
            bestseller === true ||
            bestseller === "true"
        },

        {
          new: true
        }
      );

    res.json({

      success: true,

      message:
        "Produit modifié avec succès",

      product:
        updatedProduct
    });

  } catch (error) {

    console.log(error);

    res.json({

      success: false,

      message:
        error.message
    });
  }
};






// LIST PRODUCTS
const listProduct =
  async (req, res) => {

    try {

      const product =
        await productModel.find(
          {}
        );

      res.json({
        success: true,
        data: product
      });

    } catch (error) {

      console.log(error);
    }
  };


// REMOVE PRODUCT
const removeProduct =
  async (req, res) => {

    try {

      await productModel.findByIdAndDelete(
        req.body.id
      );

      res.json({

        success: true,

        message:
          "Product deleted"
      });

    } catch (error) {

      res.json({

        success: false,

        message:
          "Product not deleted"
      });
    }
  };


// SINGLE PRODUCT
const singleProduct =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const product =
        await productModel.findById(
          id
        );

      res.json({
        success: true,
        product
      });

    } catch (error) {

      res.json({
        success: false,
        message: error.message
      });
    }
  };


export {

  addProduct,

  updateProduct,

  listProduct,

  removeProduct,

  singleProduct
};

