import userModel from "../models/userModel.js";

// ➕ Ajouter un produit aux favoris
export const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.body.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Utilisateur non trouvé." });
    }

    if (user.favorites.includes(productId)) {
      return res.json({ success: false, message: "Déjà dans les favoris." });
    }

    user.favorites.push(productId);
    await user.save();
    res.json({ success: true, message: "Ajouté aux favoris.", favorites: user.favorites });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Erreur lors de l'ajout." });
  }
};

// ➖ Retirer un produit des favoris
export const removeFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.body.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Utilisateur non trouvé." });
    }

    user.favorites = user.favorites.filter(id => id !== productId);
    await user.save();
    res.json({ success: true, message: "Retiré des favoris.", favorites: user.favorites });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Erreur lors du retrait." });
  }
};

// 📜 Liste des favoris
export const getFavorites = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Utilisateur non trouvé." });
    }

    res.json({ success: true, favorites: user.favorites });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Erreur lors de la récupération." });
  }
};
