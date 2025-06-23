import React, { useContext, useEffect, useState } from 'react'
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
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [animationDirection, setAnimationDirection] = useState(null);

    const handleSwipe = () => {
        if (!touchStartX || !touchEndX) return;

        const distance = touchStartX - touchEndX;

        if (distance > 50) {
            // Swipe gauche → image suivante
            setAnimationDirection('slide-left');
            setTimeout(() => {
                const currentIndex = productData.image.indexOf(image);
                const nextIndex = (currentIndex + 1) % productData.image.length;
                setImage(productData.image[nextIndex]);
                setAnimationDirection(null);
            }, 300);
        }

        if (distance < -50) {
            // Swipe droite → image précédente
            setAnimationDirection('slide-right');
            setTimeout(() => {
                const currentIndex = productData.image.indexOf(image);
                const prevIndex = (currentIndex - 1 + productData.image.length) % productData.image.length;
                setImage(productData.image[prevIndex]);
                setAnimationDirection(null);
            }, 300);
        }

        setTouchStartX(null);
        setTouchEndX(null);
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
                    <div className='main-image-box'>
                        <img
                            className={`main-image ${animationDirection || ''}`}
                            src={image}
                            alt="Produit"
                            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                            onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
                            onTouchEnd={handleSwipe}
                            onMouseDown={(e) => setTouchStartX(e.clientX)}
                            onMouseMove={(e) => setTouchEndX(e.clientX)}
                            onMouseUp={handleSwipe}
                            onMouseLeave={() => {
                                setTouchStartX(null);
                                setTouchEndX(null);
                            }}
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