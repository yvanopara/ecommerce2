import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shopContext';
import { useNavigate } from 'react-router-dom';
import './favorites.css';  // Import du CSS séparé

export default function Favorites() {
  const { favorites, products, currency, removeFromFavorites } = useContext(ShopContext);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      return;
    }
    const favProducts = products.filter(prod => favorites.includes(prod._id));
    setFavoriteProducts(favProducts);
  }, [favorites, products]);

  if (favoriteProducts.length === 0) {
    return (
      <div className="favorites-empty">
        Vous n'avez aucun produit favori pour le moment.
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Mes Produits Favoris</h2>
      <div className="favorites-list">
        {favoriteProducts.map(product => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="favorite-card"
          >
            <img
              src={Array.isArray(product.image) ? product.image[0] : product.image}
              alt={product.name}
              className="favorite-image"
              draggable={false}
            />
            <h3 className="favorite-name">{product.name}</h3>
            <p className="favorite-price">{product.price} {currency}</p>

            <button
              onClick={e => {
                e.stopPropagation();
                removeFromFavorites(product._id);
              }}
              title="Retirer des favoris"
              className="favorite-remove-btn"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
