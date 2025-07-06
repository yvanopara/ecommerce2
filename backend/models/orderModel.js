import mongoose from "mongoose";






const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: {type:Array,required:true},
//   items: [
//     {
//       name: { type: String, required: true },
//       quantity: { type: Number, required: true },
//       price: { type: Number, required: true },
//     },
//   ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Commande Recue" },
  date: { type: Number, required:true }, // Removed parentheses
  payment: { type: Boolean, default: false, required:true},
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
