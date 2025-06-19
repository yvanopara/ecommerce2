import React, { useContext, useEffect, useState } from 'react'
import './bestSeller.css'
import { ShopContext } from '../../context/shopContext'
import Title from '../title/Title'
import ProductItems from '../productItems/ProductItems'

export default function BestSeller() {
  const { products } = useContext(ShopContext)
  const [bestseller, setBestSeller] = useState([])

  useEffect(() => {
    if (Array.isArray(products)) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="best-seller-container">
      <div className="title-wrapper">
        <Title text1={'LES PLUS'} text2={'VENDUES'} />
      </div>

      <div className="products-container">
        {bestseller.map((item) => {
          // 👉 Gestion du prix même si le produit n’a pas de tailles
          const price = Array.isArray(item.sizes) && item.sizes.length > 0
            ? item.sizes[0].price
            : item.price;

          return (
            <div className="product-item-wrapper" key={item._id}>
              <ProductItems
                id={item._id}
                name={item.name}
                image={item.image}
                price={price}
                className="centered-product-item"
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}
