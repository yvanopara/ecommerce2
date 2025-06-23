import React, { useContext, useEffect, useState, useRef } from 'react'
import './product.css'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../../context/shopContext'
import RelatedProduct from '../../components/relatedProducts/RelatedProduct'

export default function Product() {
    const { productId } = useParams()
    const { products, currency, addToCart } = useContext(ShopContext)
    const [productData, setProductData] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [startX, setStartX] = useState(0)
    const [currentX, setCurrentX] = useState(0)
    const [isSwiping, setIsSwiping] = useState(false)
    const imageTrackRef = useRef(null)

    useEffect(() => {
        if (products.length > 0) {
            const product = products.find(item => item._id === productId)
            if (product) {
                setProductData(product)
                setCurrentImageIndex(0)
            }
        }
    }, [products, productId])

    const handleTouchStart = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        setStartX(clientX)
        setCurrentX(clientX)
        setIsSwiping(true)
    }

    const handleTouchMove = (e) => {
        if (!isSwiping) return
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        setCurrentX(clientX)
    }

    const handleTouchEnd = () => {
        if (!isSwiping) return
        
        const diff = startX - currentX
        const threshold = window.innerWidth / 4
        
        if (diff > threshold) {
            // Swipe gauche → image suivante
            goToNextImage()
        } else if (diff < -threshold) {
            // Swipe droite → image précédente
            goToPrevImage()
        }
        
        setIsSwiping(false)
    }

    const goToNextImage = () => {
        setCurrentImageIndex(prev => 
            (prev + 1) % productData.image.length
        )
    }

    const goToPrevImage = () => {
        setCurrentImageIndex(prev => 
            (prev - 1 + productData.image.length) % productData.image.length
        )
    }

    const goToImage = (index) => {
        setCurrentImageIndex(index)
    }

    const calculateTransform = () => {
        if (!isSwiping) {
            return `translateX(-${currentImageIndex * 100}%)`
        }
        
        const diff = currentX - startX
        return `translateX(calc(-${currentImageIndex * 100}% + ${diff}px))`
    }

    if (!productData) {
        return <div className="loading">Chargement...</div>
    }

    return (
        <div className='product-container'>
            <div className='product-main'>
                <div className='product-images'>
                    <div className='thumbnails'>
                        {productData.image.map((item, index) => (
                            <img
                                src={item}
                                onClick={() => goToImage(index)}
                                key={index}
                                className={`thumbnail ${index === currentImageIndex ? 'active-thumbnail' : ''}`}
                                alt={`Miniature ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className='main-image-container'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseMove={handleTouchMove}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}>
                        
                        <div 
                            ref={imageTrackRef}
                            className={`image-track ${isSwiping ? 'swiping' : ''}`}
                            style={{ transform: calculateTransform() }}>
                            
                            {productData.image.map((img, index) => (
                                <div key={index} className='image-slide'>
                                    <img
                                        src={img}
                                        className='main-image'
                                        alt={`Produit ${index + 1}`}
                                        draggable="false"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="image-nav-dots">
                            {productData.image.map((_, index) => (
                                <div 
                                    key={index}
                                    className={`nav-dot ${currentImageIndex === index ? 'active-dot' : ''}`}
                                    onClick={() => goToImage(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='product-details'>
                    <h1 className='product-name'>{productData.name}</h1>
                    
                    <div className='product-price'>
                        {productData.sizes?.length > 0 ? (
                            <span>À partir de {productData.sizes[0].price} {currency}</span>
                        ) : (
                            <span>{productData.price} {currency}</span>
                        )}
                    </div>

                    <p className='product-description'>{productData.description}</p>

                    {productData.sizes?.length > 0 && (
                        <div className='product-sizes'>
                            <p>Choisissez la taille :</p>
                            <div className='size-options'>
                                {productData.sizes.map((item, index) => (
                                    <button
                                        key={index}
                                        className='size-button'
                                    >
                                        {item.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className='add-to-cart'>
                        Ajouter au panier
                    </button>
                </div>
            </div>

            <RelatedProduct 
                category={productData.category} 
                subCategory={productData.subCategory} 
            />
        </div>
    )
}