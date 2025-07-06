import React, { useContext, useEffect, useState } from 'react';
import './cart.css';
import { ShopContext } from '../../context/shopContext';
import Title from '../../components/title/Title';
import { assets } from '../../assets/assets';
import CartTotal from '../../components/cartTotal/CartTotal';

export default function Cart() {
  const { navigate, cartItems, products, currency, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Met à jour les données du panier visuel
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const foundProduct = products.find((product) => product._id === items);
            if (foundProduct) {
              tempData.push({
                _id: items,
                size: item,
                quantity: cartItems[items][item]
              });
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className='cart-container'>
      <div className='cart-title'>
        <Title text1={'VOTRE'} text2={'PANIER'} />
      </div>

      {cartData.length === 0 ? (
        <div className='cart-empty'>
          <p>Votre panier est vide</p>
        </div>
      ) : (
        <div className='cart-items-list'>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            if (!productData) return null; // Protection si le produit n'existe pas

            // Détermination du prix selon la taille choisie
            let price = productData.price;
            if (productData.sizes && productData.sizes.length > 0) {
              const sizeInfo = productData.sizes.find(s => s.size === item.size);
              price = sizeInfo ? sizeInfo.price : productData.price;
            }

            return (
              <div key={index} className='cart-item'>
                <img
                  className='cart-item-image'
                  src={productData.image?.[0] || assets.default_image}
                  alt={productData.name}
                />

                <div className='cart-item-details'>
                  <h3 className='cart-item-name'>{productData.name}</h3>
                  <div className='cart-item-meta'>
                    <span className='cart-item-price'>{price} {currency}</span>
                    <span className='cart-item-size'>Taille : {item.size}</span>
                  </div>
                </div>

                <div className='cart-item-controls'>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, item.size, Math.max(1, parseInt(e.target.value)))
                    }
                    className='cart-item-quantity'
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className='cart-item-remove'
                  >
                    <img src={assets.bin_icon} alt="Supprimer" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="cart-flex-container">
        <div className="cart-inner-wrapper">
          <CartTotal />
          <div className='checkout-button-container'>
            <button className='checkout-button' onClick={() => navigate('/placeorder')}>
              Passez au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
