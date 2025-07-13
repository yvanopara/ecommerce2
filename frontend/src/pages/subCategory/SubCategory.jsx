import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/shopContext';

import ProductItems from '../../components/productItems/ProductItems';
import Title from '../../components/title/Title';

export default function SubCategory() {
  const { category, subcategory } = useParams();
  const { products } = useContext(ShopContext);

  // ✅ Filtre + mélange une seule fois grâce à useMemo
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const filtered = products.filter(
      (product) =>
        product.subCategory?.toLowerCase() === subcategory?.toLowerCase()
    );
    return filtered.sort(() => Math.random() - 0.5);
  }, [products, subcategory]);

  return (
    <div className="category-page-container">
      <div className="title-wrapper">
        <Title text1={subcategory?.toUpperCase()} text2={'COLLECTION'} />
      </div>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => {
            const price =
              Array.isArray(item.sizes) && item.sizes.length > 0
                ? item.sizes[0].price
                : item.price;

            return (
              <div className="product-item-wrapper" key={item._id}>
                <ProductItems
                  name={item.name}
                  id={item._id}
                  image={item.image}
                  price={price}
                  className="centered-product-item"
                />
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center' }}>
            Aucun produit trouvé dans cette sous-catégorie.
          </p>
        )}
      </div>
    </div>
  );
}
