
import mongoose from "mongoose";
import slugify from "slugify";

import productModel from "../models/productModel.js";


// connexion mongo (comme db.js)
await mongoose.connect(
  "mongodb+srv://yvanopara1845:0000000000@cluster0.5wkfb.mongodb.net/project0?retryWrites=true&w=majority&appName=Cluster0"
);

const addSlug =
  async () => {

    try {

      const products =
        await productModel.find(
          {}
        );

      console.log(
        "PRODUITS TROUVÉS :",
        products.length
      );

      for (
        const product of products
      ) {

        if (
          !product.slug
        ) {

          product.slug =
            slugify(
              product.name,
              {
                lower: true,
                strict: true
              }
            );

          await product.save();

          console.log(
            "SLUG AJOUTÉ :",
            product.slug
          );
        }
      }

      console.log(
        "FINI ✅"
      );

      process.exit();

    } catch (
      error
    ) {

      console.log(
        error
      );

      process.exit(
        1
      );
    }
  };

addSlug();
