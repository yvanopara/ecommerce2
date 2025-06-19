import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { 
    type: Number,
    required: function() {
      // price obligatoire seulement si sizes est vide ou absent
      return !this.sizes || this.sizes.length === 0;
    }
  },
  image: { type: [String], required: true }, // tableau de strings (URLs)
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [sizeSchema], default: [] }, // tableau d’objets {size, price}, par défaut vide
  bestseller: { type: Boolean, default: false },
  date: { type: Number, required: true }
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);
export default productModel;
