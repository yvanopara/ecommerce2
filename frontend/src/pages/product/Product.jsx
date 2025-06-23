import React, { useContext, useEffect, useState, useRef } from 'react'
import './product.css'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../../context/shopContext';
import { assets } from '../../assets/assets';
import RelatedProduct from '../../components/relatedProducts/RelatedProduct';

export default function Product() {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [size, setSize] = useState(null);
    const [startX, setStartX] = useState(null);
    const [currentX, setCurrentX] = useState(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const imageRef = useRef(null);

    const handleTouchStart = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setCurrentX(clientX);
        setIsSwiping(true);
        if (imageRef.current) {
            imageRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e) => {
        if (!isSwiping || startX === null) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setCurrentX(clientX);
        
        if (imageRef.current) {
            const diff = clientX - startX;
            imageRef.current.style.transform = `translateX(${diff}px)`;
        }
    };

    const handleTouchEnd = () => {
        if (!isSwiping || startX === null || currentX === null) {
            setIsSwiping(false);
            return;
        }
        
        const diff = startX - currentX;
        const threshold = window.innerWidth / 4;
        
        if (diff > threshold) {
            goToNextImage();
        } else if (diff < -threshold) {
            goToPrevImage();
        }
        
        if (imageRef.current) {
            imageRef.current.style.transform = 'translateX(0)';
            imageRef.current.style.transition = 'transform 0.3s ease';
        }
        
        setIsSwiping(false);
        setStartX(null);
        setCurrentX(null);
    };

    const goToNextImage = () => {
        const currentIndex = productData.image.indexOf(image);
        const nextIndex = (currentIndex + 1) % productData.image.length;
        setImage(productData.image[nextIndex]);
    };

    const goToPrevImage = () => {
        const currentIndex = productData.image.indexOf(image);
        const prevIndex = (currentIndex - 1 + productData.image.length) % productData.image.length;
        setImage(productData.image[prevIndex]);
    };

    const fetchProductData = () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image[0]);
                return null;
            }
        });
    };

    useEffect(() => {
        fetchProductData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [products, productId]);

    return productData ? (
        <div className='product-container'>
            <div className='product-main'>
                <div className='product-images'>
                    <div className='thumbnails'>
                        {productData.image.map((item, index) => (
                            <img
                                src={item}
                                onClick={() => setImage(item)}
                                key={index}
                                className={`thumbnail ${item === image ? 'active-thumbnail' : ''}`}
                            />
                        ))}
                    </div>
                    <div className='main-image-box'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseMove={handleTouchMove}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}>
                        <img
                            ref={imageRef}
                            className='main-image'
                            src={image}
                            alt="Produit"
                            style={{ cursor: 'grab' }}
                        />
                    </div>
                </div>

                <div className='product-details'>
                    <h1 className='product-name2'>{productData.name}</h1>

                    <div className='product-price'>
                        {productData.sizes && productData.sizes.length > 0 ? (
                            size ? (
                                <span>{size.price} {currency}</span>
                            ) : (
                                <span>À partir de {productData.sizes[0].price} {currency}</span>
                            )
                        ) : (
                            <span>{productData.price || 'Prix non défini'} {currency}</span>
                        )}
                    </div>

                    <p className='product-descriptionn'>{productData.description}</p>

                    {productData.sizes && productData.sizes.length > 0 && (
                        <div className='product-sizes'>
                            <p>Choisissez la taille :</p>
                            <div className='size-options'>
                                {productData.sizes.map((item, index) => (
                                    <button
                                        onClick={() => setSize(item)}
                                        className={`size-button ${size?.size === item.size ? 'active-size' : ''}`}
                                        key={index}
                                    >
                                        {item.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => addToCart(productData._id, size?.size || 'unique')}
                        className='add-to-cart'
                        disabled={productData.sizes?.length > 0 && !size}
                    >
                        {productData.sizes?.length > 0 && !size ? 'Choisissez une taille' : 'Ajouter au panier'}
                    </button>
                </div>
            </div>

            <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : <div style={{ opacity: '0' }}></div>;
}