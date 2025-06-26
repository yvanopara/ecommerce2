import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/shopContext';
import './category.css';
import ProductItems from '../../components/productItems/ProductItems';
import Title from '../../components/title/Title';

export default function Category() {
  const { category } = useParams();
  const { products } = useContext(ShopContext);

 const filteredProducts = Array.isArray(products)
  ? products.filter(
      (product) =>
        product.category?.toLowerCase() === category?.toLowerCase()
    )
  : [];


  return (
    <div className="category-page-container">
      <div className="title-wrapper">
        <Title text1={category.toUpperCase()} text2={'COLLECTION'} />
      </div>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => {
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
                  className="centered-product-item"
                />
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center' }}>Aucun produit trouvé dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
}
