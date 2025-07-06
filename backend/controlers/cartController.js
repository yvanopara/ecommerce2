import userModel from "../models/userModel.js"


//ADD product to User cart





const addToCart = async(req,res) =>{
    try {
        const{userId,itemId, size } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] +=1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] ={}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId,{cartData})

        res.json({success:true, message:'Le produit a ete ajoute au Panier'})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//update product to User cart
const updateCart = async(req,res) =>{
    try {
        const {userId, itemId,size,quantity} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId,{cartData})
        res.json({success:true, message: 'Panier mise a jour !'})
    } catch (error) {
         res.json({success:false, message:error.message})
    }
}

//get product to User cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        res.json({ success: true, cartData: userData.cartData }); // Correction ici
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
export {addToCart,updateCart,getUserCart}