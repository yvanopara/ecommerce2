import React, { useContext, useEffect, useState } from 'react';
import './relatedProduct.css';
import { ShopContext } from '../../context/shopContext';
import Title from '../title/Title';
import ProductItems from '../productItems/ProductItems';

export default function RelatedProduct({ category, subCategory }) {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.filter((item) =>
                item.category === category && item.subCategory === subCategory
            );
            setRelated(productsCopy.slice(0, 5));
        }
    }, [products, category, subCategory]);

    return (
        <div className="related-section">
            <div className="related-title">
                <Title text1="PRODUIT" text2="SIMILAIR" />
            </div>

            <div className="related-scroll-container">
                {related.map((item, index) => (
                    <div className="related-product-card" key={index}>
                        <ProductItems
                            id={item._id} // ✅ Corrigé ici !
                            name={item.name}
                            image={item.image}
                            price={item.price}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
