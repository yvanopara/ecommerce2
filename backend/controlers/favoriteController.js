import userModel from '../models/userModel.js';

export const getFavorites = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToFavorites = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ success: true, message: "Ajouté aux favoris" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromFavorites = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ success: true, message: "Retiré des favoris" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
