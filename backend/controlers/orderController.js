
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// const frontedUrl = "/mr-lands-store.onrender.com/"; 

// // This could be a payment session or confirmation page

// Placing user order for front-end
const placeOrder = async (req, res) => {
   try {
      const { userId, items, amount, address } = req.body;
      console.log("REQ.BODY =>", req.body);
      const orderData = {
         userId,
         items,
         amount,
         address,
         payment: false,
         date: Date.now()
      }
      const newOrder = new orderModel(orderData)
      await newOrder.save();
      // Clear the user's cart
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: 'vous avez placer une commande' });
      //   // Example: Redirect URL after successful order (this could be a payment session URL or confirmation page)
      //   const session_url = `/verify?orderId=${newOrder._id}`;
      //   console.log("Session URL:", session_url);
      //   // Respond with the session URL for redirection
      //   res.json({ success: true, session_url });
   } catch (error) {
      res.json({ success: false, message: error.message });
      console.log(error);
   }
};


//user orders for frontend
const userOrders = async (req, res) => {
   try {
      const { userId } = req.body
      const orders = await orderModel.find({ userId });
      res.json({ success: true, orders });

   } catch (error) {
      res.json({ success: false, message: error.message });
      console.log(error);
   }
}

// listing all orders
const allOrders = async (req, res) => {
   try {
      const orders = await orderModel.find({})
      res.json({ success: true, orders })
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message })

   }
}


//update oder from admin
const updateStatus = async (req, res) => {
   try {
      const { orderId, status } = req.body


      await orderModel.findByIdAndUpdate(orderId, {status})
      res.json({ success: true, message: "statut Modifier avec success" })

   } catch (error) {
      res.json({ success: false, message:error.message })
   }
}

// backend/controllers/orderController.js
const paymentUpdate = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.status(200).json({ success: true, message: "Paiement mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur de mise à jour du paiement" });
  }
};

export { placeOrder, userOrders, allOrders, updateStatus,paymentUpdate };
