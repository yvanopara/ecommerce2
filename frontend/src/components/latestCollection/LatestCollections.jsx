import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/shopContext'
import Title from '../title/Title'
import './latestCollection.css'
import ProductItems from '../productItems/ProductItems'

export default function LatestCollections() {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    if (Array.isArray(products)) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <div className="latest-collections-container">
      <div  className="title-wrapper">
        <Title text1={'LES PRODUITS'} text2={'RECCENTS'} />
      </div>

      <div className="products-container">
        {latestProducts.map((item) => {
          // 👉 Gestion du prix même si le produit n’a pas de tailles
          const price = Array.isArray(item.sizes) && item.sizes.length > 0
            ? item.sizes[0].price
            : item.price;

          return (
            <div className="product-item-wrapper" key={item._id}>
              <ProductItems
                name={item.name}
                slug={item.slug}
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
