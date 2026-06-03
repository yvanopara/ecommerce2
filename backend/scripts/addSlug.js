import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import { connectDB } from "../config/db.js";

function createSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const addSlug = async () => {

  try {

    await connectDB();

    const products =
      await productModel.find({});

    console.log(
      "PRODUITS TROUVÉS :",
      products.length
    );

    for (const product of products) {

      // seulement ceux sans slug
      if (!product.slug) {

        let baseSlug =
          createSlug(product.name);

        let slug =
          baseSlug;

        let count = 1;

        // éviter doublons
        while (
          await productModel.findOne({
            slug
          })
        ) {

          slug =
            `${baseSlug}-${count}`;

          count++;
        }

        // update direct Mongo
        await productModel.updateOne(
          { _id: product._id },
          {
            $set: {
              slug
            }
          }
        );

        console.log(
          "SLUG AJOUTÉ :",
          product.name,
          "=>",
          slug
        );
      }
    }

    console.log("FINI ✅");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

addSlug();