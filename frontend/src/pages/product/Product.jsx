import React, { useContext, useEffect, useState, useRef } from 'react';
import './product.css';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/shopContext';
import { assets } from '../../assets/assets';
import RelatedProduct from '../../components/relatedProducts/RelatedProduct';

export default function Product() {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState(null);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const imageTrackRef = useRef(null);

    // 🧠 Utiliser find au lieu de map + setTimeout pour éviter blocage DOM
    useEffect(() => {
        setProductData(null); // reset state pour forcer le rechargement propre
        const item = products.find((item) => item._id === productId);
        if (item) {
            setProductData(item);
            setImage(item.image[0]);
            setSize(null);
            setIsSwiping(false); // Reset swipe pour éviter conflits
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 0);
        }
    }, [products, productId]);

    const handleTouchStart = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setCurrentX(clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e) => {
        if (!isSwiping) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setCurrentX(clientX);
    };

    const handleTouchEnd = () => {
        if (!isSwiping) return;

        const diff = startX - currentX;
        const threshold = window.innerWidth / 4;

        if (diff > threshold) {
            goToNextImage();
        } else if (diff < -threshold) {
            goToPrevImage();
        }

        setIsSwiping(false);
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

    const calculateTransform = () => {
        if (!productData || !productData.image) return 'translateX(0%)';

        if (!isSwiping) {
            return `translateX(-${productData.image.indexOf(image) * 100}%)`;
        }

        const diff = currentX - startX;
        return `translateX(calc(-${productData.image.indexOf(image) * 100}% + ${diff}px))`;
    };

    if (!productData) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Chargement...</div>;
    }

    return (
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
                                        className={`main-image ${image === img ? 'active' : ''}`}
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
                                    className={`nav-dot ${image === productData.image[index] ? 'active-dot' : ''}`}
                                    onClick={() => setImage(productData.image[index])}
                                />
                            ))}
                        </div>
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

            <RelatedProduct
                category={productData.category}
                subCategory={productData.subCategory}
            />
        </div>
    );
}
