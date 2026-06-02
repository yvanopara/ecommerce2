
import React, {
    useContext,
    useEffect,
    useState,
    useRef
} from 'react';

import './product.css';

import {
    useParams
} from 'react-router-dom';

import {
    ShopContext
} from '../../context/shopContext';

import RelatedProduct from '../../components/relatedProducts/RelatedProduct';

import {
    FaWhatsapp,
    FaHeart
} from 'react-icons/fa';

import {
    ShoppingCart
} from 'lucide-react';

import {
    Helmet
} from 'react-helmet-async';


export default function Product() {

    // SEO URL
    const { slug } = useParams();

    const {
        products,
        currency,
        addToCart,
        favorites,
        addToFavorites,
        removeFromFavorites,
    } = useContext(
        ShopContext
    );

    const [
        productData,
        setProductData
    ] = useState(null);

    const [
        image,
        setImage
    ] = useState('');

    const [
        size,
        setSize
    ] = useState(null);

    const [
        startX,
        setStartX
    ] = useState(0);

    const [
        currentX,
        setCurrentX
    ] = useState(0);

    const [
        isSwiping,
        setIsSwiping
    ] = useState(false);

    const imageTrackRef =
        useRef(null);


    useEffect(() => {

        if (
            !slug ||
            products.length === 0
        ) return;

        const item =
            products.find(
                (item) =>
                    item.slug === slug
            );

        if (item) {

            setProductData(
                item
            );

            setImage(
                Array.isArray(
                    item.image
                )
                    ? item.image[0]
                    : item.image
            );

            setSize(null);

            setIsSwiping(
                false
            );

            window.scrollTo({
                top: 0,
                behavior:
                    'smooth'
            });
        }

    }, [
        products,
        slug
    ]);


    const handleTouchStart =
        (e) => {

            const clientX =
                e.touches
                    ? e.touches[0]
                        .clientX
                    : e.clientX;

            setStartX(
                clientX
            );

            setCurrentX(
                clientX
            );

            setIsSwiping(
                true
            );
        };


    const handleTouchMove =
        (e) => {

            if (
                !isSwiping
            ) return;

            const clientX =
                e.touches
                    ? e.touches[0]
                        .clientX
                    : e.clientX;

            setCurrentX(
                clientX
            );
        };


    const handleTouchEnd =
        () => {

            if (
                !isSwiping
            ) return;

            const diff =
                startX -
                currentX;

            const threshold =
                window.innerWidth /
                4;

            if (
                diff >
                threshold
            ) {

                goToNextImage();

            } else if (
                diff <
                -threshold
            ) {

                goToPrevImage();
            }

            setIsSwiping(
                false
            );
        };


    const goToNextImage =
        () => {

            const currentIndex =
                productData.image.indexOf(
                    image
                );

            const nextIndex =
                (
                    currentIndex +
                    1
                ) %
                productData.image
                    .length;

            setImage(
                productData
                    .image[
                    nextIndex
                ]
            );
        };


    const goToPrevImage =
        () => {

            const currentIndex =
                productData.image.indexOf(
                    image
                );

            const prevIndex =
                (
                    currentIndex -
                    1 +
                    productData.image
                        .length
                ) %
                productData.image
                    .length;

            setImage(
                productData
                    .image[
                    prevIndex
                ]
            );
        };


    const calculateTransform =
        () => {

            if (
                !productData ||
                !productData.image
            ) {

                return 'translateX(0%)';
            }

            if (
                !isSwiping
            ) {

                return `translateX(-${productData.image.indexOf(image) * 100}%)`;
            }

            const diff =
                currentX -
                startX;

            return `translateX(calc(-${productData.image.indexOf(image) * 100}% + ${diff}px))`;
        };


    if (!productData) {

        return (
            <div
                style={{
                    padding:
                        '4rem',
                    textAlign:
                        'center'
                }}
            >
                Chargement...
            </div>
        );
    }


    // FAVORIS = _id
    const isFavorite =
        favorites.includes(
            productData._id
        );

    const toggleFavorite =
        () => {

            if (
                isFavorite
            ) {

                removeFromFavorites(
                    productData._id
                );

            } else {

                addToFavorites(
                    productData._id
                );
            }
        };


    return (
        <>

            <Helmet>

                <title>
                    {
                        productData.name
                    } | K-Mystore
                </title>

                <meta
                    name="description"
                    content={`
Découvrez ${productData.name} sur K-Mystore.
${productData.description?.slice(0, 120)}
Livraison discrète et rapide au Cameroun.
`}
                />

                <meta
                    name="keywords"
                    content={`
${productData.name},
${productData.category},
${productData.subCategory || ""},
boutique intime Cameroun,
lingerie Cameroun,
produits beauté Cameroun,
parfums Cameroun,
K-Mystore
`}
                />

                <meta
                    property="og:title"
                    content={`${productData.name} | K-Mystore`}
                />

                <meta
                    property="og:description"
                    content={productData.description}
                />

                <meta
                    property="og:image"
                    content={productData.image?.[0]}
                />

                <meta
                    property="og:type"
                    content="product"
                />

                <meta
                    property="og:url"
                    content={window.location.href}
                />

            </Helmet>

            <div className="product-container">

                {/* le reste de ton JSX actuel reste identique */}

            </div>

        </>
    );
}

