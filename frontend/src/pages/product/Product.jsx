import React, { useContext, useEffect, useState } from 'react';
import './product.css';
import { useParams } from 'react-router-dom';
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
    const [animating, setAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState('in');

    const fetchProductData = () => {
        products.forEach((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image[0]);
            }
        });
    };

    useEffect(() => {
        fetchProductData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [products, productId]);

    const handleSwipe = () => {
        if (!touchStartX || !touchEndX || animating) return;

        const distance = touchStartX - touchEndX;

        if (distance > 50) {
            slideTo('left');
        } else if (distance < -50) {
            slideTo('right');
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };

    const slideTo = (direction) => {
        setAnimating(true);
        setSlideDirection(direction);

        setTimeout(() => {
            const currentIndex = productData.image.indexOf(image);
            const total = productData.image.length;

            if (direction === 'left') {
                const nextIndex = (currentIndex + 1) % total;
                setImage(productData.image[nextIndex]);
            } else {
                const prevIndex = (currentIndex - 1 + total) % total;
                setImage(productData.image[prevIndex]);
            }

            setSlideDirection('in');
            setTimeout(() => setAnimating(false), 400);
        }, 100);
    };

    return productData ? (
        <div className='product-container'>
            <div className='product-main'>
                <div className='product-images'>
                    {/* Miniatures */}
                    <div className='thumbnails'>
                        {productData.image.map((item, index) => (
                            <img
                                key={index}
                                src={item}
                                onClick={() => setImage(item)}
                                className={`thumbnail ${item === image ? 'active-thumbnail' : ''}`}
                                alt={`thumbnail-${index}`}
                            />
                        ))}
                    </div>

                    {/* Image principale avec swipe + animation */}
                    <div className='main-image-box'>
                        <div
                            className='image-slider'
                            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                            onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
                            onTouchEnd={handleSwipe}
                        >
                            <img
                                src={image}
                                alt="Produit"
                                className={`slider-image ${
                                    slideDirection === 'left'
                                        ? 'slide-left'
                                        : slideDirection === 'right'
                                        ? 'slide-right'
                                        : 'slide-in'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Détails produit */}
                <div className='product-details'>
                    <h1 className='product-name2'>{productData.name}</h1>

                    <div className='product-price'>
                        {productData.sizes?.length > 0 ? (
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

                    {productData.sizes?.length > 0 && (
                        <div className='product-sizes'>
                            <p>Choisissez la taille :</p>
                            <div className='size-options'>
                                {productData.sizes.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSize(item)}
                                        className={`size-button ${size?.size === item.size ? 'active-size' : ''}`}
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
