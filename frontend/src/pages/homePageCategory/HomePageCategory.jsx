import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../../context/shopContext';
import { useNavigate } from 'react-router-dom';

import './homePageCategory.css';
import ProductItems from '../../components/productItems/ProductItems';

export default function HomePage() {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  // Grouper les produits par catégorie
  const groupedByCategory = {};
  products.forEach(product => {
    const category = product.category || 'Autres';
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }
    groupedByCategory[category].push(product);
  });

  // ✅ Mélanger les produits de chaque catégorie UNE SEULE FOIS
  const shuffledByCategory = useMemo(() => {
    const shuffled = {};
    for (const [category, items] of Object.entries(groupedByCategory)) {
      shuffled[category] = [...items].sort(() => Math.random() - 0.5);
    }
    return shuffled;
  }, [products]);

  return (
    <div className="home-page-container">
      {Object.entries(shuffledByCategory)
        .filter(([category]) => {
          const allowed = ['femme', 'parfum', 'electronic', 'maison'];
          return allowed.includes(category.trim().toLowerCase());
        })
        .map(([category, items]) => (
          <div key={category} className="latest-collections-container">
            <div className="title-wrapper">
              <h2 className="category-title">{category.toUpperCase()}</h2>
              <button
                className="view-all-button"
                onClick={() => navigate(`/collection/${category}`)}
              >
                Voir tous
              </button>
            </div>

            <div className="products-container">
              {items.slice(0, 10).map(item => {
                const price = Array.isArray(item.sizes) && item.sizes.length > 0
                  ? item.sizes[0].price
                  : item.price;

                return (
                  <div className="product-item-wrapper" key={item._id}>
                    <ProductItems
                      name={item.name}
                      id={item._id}
                      image={item.image}
                      price={price}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
