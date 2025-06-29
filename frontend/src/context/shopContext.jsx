import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'FCFA';
    const delivery_fee = 1000;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setproducts] = useState([])
    const [token, setToken] = useState('')

    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate()

    // Fonction pour récupérer les favoris de l'utilisateur
    const getFavorites = async () => {
        if (!token) return;
        try {
            const res = await axios.post(
                backendUrl + '/api/user/favorites/list',
                {},
                { headers: { token } }
            );
            if (res.data.success) {
                setFavorites(res.data.favorites);
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des favoris");
        }
    };

    // Ajouter un produit aux favoris
    const addToFavorites = async (productId) => {
        if (!token) {
            toast.info("Connectez-vous pour ajouter aux favoris");
            return;
        }
        try {
            const res = await axios.post(
                backendUrl + '/api/user/favorites/add',
                { productId },
                { headers: { token } }
            );
            if (res.data.success) {
                setFavorites(res.data.favorites);
                toast.success("Produit ajouté aux favoris");
            } else {
                toast.info(res.data.message);
            }
        } catch (error) {
            toast.error("Erreur lors de l'ajout aux favoris");
        }
    };

    // Retirer un produit des favoris
    const removeFromFavorites = async (productId) => {
        if (!token) {
            toast.info("Connectez-vous pour gérer vos favoris");
            return;
        }
        try {
            const res = await axios.post(
                backendUrl + '/api/user/favorites/remove',
                { productId },
                { headers: { token } }
            );
            if (res.data.success) {
                setFavorites(res.data.favorites);
                toast.success("Produit retiré des favoris");
            } else {
                toast.info(res.data.message);
            }
        } catch (error) {
            toast.error("Erreur lors du retrait des favoris");
        }
    };

    // Charger les favoris automatiquement à la connexion / chargement du token
    useEffect(() => {
        if (token) {
            getFavorites();
        } else {
            setFavorites([]);
        }
    }, [token]);


    const addToCart = async (itemId, size) => {


        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
                console.log(cartItems)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }
    useEffect(() => {
        console.log(cartItems)
        console.log("Cart count:", getCartCount());
    }, [cartItems])

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                toast.error(error.message)
                console.log(error)
            }
        }
    }
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;

            for (const item in cartItems[items]) {
                try {
                    const quantity = parseInt(cartItems[items][item]) || 0;
                    if (quantity > 0) {
                        // Gestion des prix par taille
                        let price = 0;
                        if (itemInfo.sizes && itemInfo.sizes.length > 0) {
                            const sizeInfo = itemInfo.sizes.find(s => s.size === item);
                            price = sizeInfo ? parseFloat(sizeInfo.price) || 0 : 0;
                        } else {
                            price = parseFloat(itemInfo.price) || 0;
                        }
                        totalAmount += price * quantity;
                    }
                } catch (error) {
                    console.error("Erreur calcul panier:", error);
                }
            }
        }
        return totalAmount;
    };

    const getProductData = async () => {

        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setproducts(response.data.data)
                console.log(response.data)


            } else {
                toast.error(response.data.message)

            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }



    useEffect(() => {
        getProductData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))

        }
    }, [])
    const value = {
        products,
        currency,
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch, setCartItems,
        cartItems, addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl, token, setToken,
        favorites,
  addToFavorites,
  removeFromFavorites,

    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider 