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

    const [animating, setAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');

    const handleSwipe = () => {
        if (!touchStartX || !touchEndX || animating) return;

        const distance = touchStartX - touchEndX;

        if (distance > 50) {
            // Swipe gauche → image suivante
            slideTo('left');
        } else if (distance < -50) {
            // Swipe droite → image précédente
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

            // Revenir à slide-in
            setSlideDirection('in');
            setTimeout(() => setAnimating(false), 400); // durée de l’animation
        }, 100);
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
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 remonte la page
    }, [products, productId]);


    useEffect(() => {
        fetchProductData();
    }, [products, productId]);

    return productData ? (
        <div className='product-container'>
            <div className='product-main'>
                <div className='product-images'>
                    <div className='thumbnails'>
                        {productData.image.map((item, index) => (
                            <div className="image-slider"
                                onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                                onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
                                onTouchEnd={handleSwipe}
                            >
                                <img
                                    src={image}
                                    alt="Produit"
                                    className={`slider-image ${slideDirection === 'left' ? 'slide-left' :
                                            slideDirection === 'right' ? 'slide-right' :
                                                'slide-in'
                                        }`}
                                />
                            </div>

                        ))}
                    </div>
                    <div className='main-image-box'>
                        <img
                            className='main-image'
                            src={image}
                            alt="Produit"
                            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                            onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
                            onTouchEnd={() => handleSwipe()}
                            style={{ cursor: 'grab' }}
                        />

                    </div>
                </div>

                <div className='product-details'>
                    <h1 className='product-name2'>{productData.name}</h1>
                    {/* <div className='product-rating'>
                        {[1, 2, 3, 4].map((_, i) => (
                            <img key={i} src={assets.star_icon} className='star-icon' alt='star' />
                        ))}
                        <img src={assets.star_dull_icon} className='star-icon' alt='star' />
                        <span className='rating-count'>(122)</span>
                    </div> */}

                    {/* 💰 Gérer prix : avec ou sans tailles */}
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

                    {/* 👕 Choix de taille (s’il y en a) */}
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

                    {/* 🛒 Bouton panier */}
                    <button
                        onClick={() => addToCart(productData._id, size?.size || 'unique')}
                        className='add-to-cart'
                        disabled={productData.sizes?.length > 0 && !size}
                    >
                        {productData.sizes?.length > 0 && !size ? 'Choisissez une taille' : 'Ajouter au panier'}
                    </button>

                    {/* <div className='product-perks'>
                        <p>✔️ 100% Original</p>
                        <p>✔️ Paiement à la livraison</p>
                    </div> */}
                </div>
            </div>

            {/* <div className='product-description-section'>
                <div className='tabs'>
                    <span className='tab active-tab'>Description</span>
                    <span className='tab'>Avis (122)</span>
                </div>
                <div className='tab-content'>
                    <p>{productData.longDescription || 'Aucune description longue disponible.'}</p>
                </div>
            </div> */}

            <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : <div style={{ opacity: '0' }}></div>;
}
