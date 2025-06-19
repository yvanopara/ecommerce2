import React, { useContext } from 'react'
import { ShopContext } from '../../context/shopContext'
import './productItems.css'
import { Link } from 'react-router-dom'

export default function ProductItems({ id, name, image, price }) {
    const { currency } = useContext(ShopContext)

    return (
        <Link to={`/product/${id}`} className='product-item'>
            <div className='image-wrapper'>
                <img 
                    src={image[0]} 
                    alt={name}
                    loading='lazy'
                />
            </div>
            <div className='product-info'>
                <p className='product-name'>{name}</p>
                <p className='product-price'>{price} {currency}</p>
            </div>
        </Link>
    )
}