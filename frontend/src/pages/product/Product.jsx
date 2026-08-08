import React, {
    useContext,
    useEffect,
    useState,
    useRef
} from 'react';

import './product.css';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/shopContext';
import RelatedProduct from '../../components/relatedProducts/RelatedProduct';
import { FaWhatsapp, FaHeart } from 'react-icons/fa';
import { ShoppingCart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductTabs from '../../components/productTabs/ProductTabs';

export default function Product() {

    const { slug } = useParams();

    const {
        products,
        currency,
        addToCart,
        favorites,
        addToFavorites,
        removeFromFavorites,
    } = useContext(ShopContext);

    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState(null);

    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    const imageTrackRef = useRef(null);

    useEffect(() => {

        if (!slug || products.length === 0) return;

        const item = products.find(
            (item) => item.slug === slug
        );
        if (item) {
            setProductData(item);
            setImage(
                Array.isArray(item.image)
                    ? item.image[0]
                    : item.image
            );
            setSize(null);
            setIsSwiping(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }, [products, slug]);

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
        if (!isSwiping) return `translateX(-${productData.image.indexOf(image) * 100}%)`;
        const diff = currentX - startX;
        return `translateX(calc(-${productData.image.indexOf(image) * 100}% + ${diff}px))`;
    };

    if (!productData) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                Chargement...
            </div>
        );
    }

    const isFavorite = favorites.includes(productData._id);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(productData._id);
        } else {
            addToFavorites(productData._id);
        }
    };

    return (
        <>
            <Helmet>
                <title>{productData.name} | K-Mystore</title>
                <meta
                    name="description"
                    content={`Découvrez ${productData.name} sur K-Mystore. ${productData.description?.slice(0, 120)} Livraison discrète et rapide au Cameroun.`}
                />
                <meta
                    name="keywords"
                    content={`${productData.name}, ${productData.category}, ${productData.subCategory || ""}, boutique intime Cameroun, lingerie Cameroun, produits beauté Cameroun, parfums Cameroun, K-Mystore`}
                />
                <meta property="og:title" content={`${productData.name} | K-Mystore`} />
                <meta property="og:description" content={productData.description} />
                <meta property="og:image" content={productData.image?.[0]} />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={window.location.href} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: productData.name,
                        image: productData.image,
                        description: productData.description,
                        sku: productData._id,
                        category: productData.category,
                        brand: { "@type": "Brand", name: "K-Mystore" },
                        offers: {
                            "@type": "Offer",
                            url: window.location.href,
                            priceCurrency: "XAF",
                            price: size?.price || productData.price,
                            availability: "https://schema.org/InStock",
                            itemCondition: "https://schema.org/NewCondition"
                        }
                    })}
                </script>
            </Helmet>

            <div className="product-container">
                <div className="product-main">

                    <div className="product-images">
                        <div className="thumbnails">
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

                        <div
                            className="main-image-container"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleTouchStart}
                            onMouseMove={handleTouchMove}
                            onMouseUp={handleTouchEnd}
                            onMouseLeave={handleTouchEnd}
                        >
                            <div
                                ref={imageTrackRef}
                                className={`image-track ${isSwiping ? 'swiping' : ''}`}
                                style={{ transform: calculateTransform() }}
                            >
                                {productData.image.map((img, index) => (
                                    <div key={index} className="image-slide">
                                        <img
                                            src={img}
                                            className={`main-image ${image === img ? 'active' : ''}`}
                                            alt={`Produit ${index + 1}`}
                                            draggable="false"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
                                onClick={toggleFavorite}
                            >
                                <FaHeart />
                            </button>

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

                    <div className="product-details">

                        <h1 className="product-name2">
                            {productData.name}
                        </h1>

                        <div className="product-price">
                            {productData.sizes?.length > 0 ? (
                                size ? (
                                    <span>{size.price} {currency}</span>
                                ) : (
                                    <span>À partir de {productData.sizes[0].price} {currency}</span>
                                )
                            ) : (
                                <span>{productData.price} {currency}</span>
                            )}
                        </div>

                        {productData.sizes?.length > 0 && (
                            <div className="product-sizes">
                                <p>Choisissez la taille :</p>
                                <div className="size-options">
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

                        <div className="action-buttons">

                            <button
                                onClick={() =>
                                    addToCart(
                                        productData._id,
                                        size?.size || 'unique'
                                    )
                                }
                                className="add-to-cart"
                                disabled={productData.sizes?.length > 0 && !size}
                            >
                                {productData.sizes?.length > 0 && !size
                                    ? 'Choisissez une taille'
                                    : <>
                                        <ShoppingCart
                                            size={18}
                                            strokeWidth={2}
                                            style={{ marginRight: '8px', flexShrink: 0 }}
                                        />
                                        Ajouter au panier
                                    </>
                                }
                            </button>

                            <a
                                className="whatsapp-button"
                                href={`https://wa.me/237680639659?text=${encodeURIComponent(
                                    `Bonjour, je suis intéressé par *${productData.name}* à *${size?.price || productData.price} ${currency}*.\nVoici le lien du produit : ${window.location.href}\nPouvez-vous me donner plus d'infos ?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp className="whatsapp-icon" />
                                <span className="whatsapp-label">Commandez sur WhatsApp</span>
                            </a>

                        </div>

                        <ProductTabs product={productData} />

                    </div>
                </div>

                <RelatedProduct
                    category={productData.category}
                    subCategory={productData.subCategory}
                />
            </div>
        </>
    );
}