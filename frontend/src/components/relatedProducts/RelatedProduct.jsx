import React, { useContext, useEffect, useState } from 'react'
import './relatedProduct.css'
import { ShopContext } from '../../context/shopContext'
import Title from '../title/Title'
import ProductItems from '../productItems/ProductItems'

export default function RelatedProduct({ category, subCategory }) {
    const { products } = useContext(ShopContext)
    const [related, setRelated] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter((item) => category === item.category)
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
            setRelated(productsCopy.slice(0, 5))
        }
    }, [products])

    return (
        <div className='related-products-container'>
            <div className='related-title'>
                <Title text1={'PRODUIT'} text2={'SIMILAIR'} />
            </div>

            <div className='related-grid'>
                {related.map((item, index) => (
                    <ProductItems
                        key={index}
                        id={item._id}
                        name={item.name}
                        image={item.image}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}
