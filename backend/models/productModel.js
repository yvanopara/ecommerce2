
import mongoose from "mongoose";
import slugify from "slugify";

const sizeSchema =
  new mongoose.Schema({
    size: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    }
  });

const productSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },

      // SEO URL
      slug: {
        type: String,
        unique: true
      },

      description: {
        type: String,
        required: true
      },

      price: {
        type: Number,

        required:
          function () {
            return (
              !this.sizes ||
              this.sizes
                .length ===
                0
            );
          }
      },

      image: {
        type: [String],
        required: true
      },

      category: {
        type: String,
        required: true
      },

      subCategory: {
        type: String,
        required: true
      },

      sizes: {
        type: [
          sizeSchema
        ],
        default: []
      },

      bestseller: {
        type: Boolean,
        default: false
      },

      date: {
        type: Number,
        required: true
      }
    },
    {
      timestamps:
        true
    }
  );


// AUTO SLUG
productSchema.pre(
  "save",
  function (next) {

    if (
      !this.slug
    ) {

      this.slug =
        slugify(
          this.name,
          {
            lower:
              true,
            strict:
              true
          }
        );
    }

    next();
  }
);

const productModel =
  mongoose.models
    .product ||
  mongoose.model(
    "product",
    productSchema
  );

export default
  productModel;

