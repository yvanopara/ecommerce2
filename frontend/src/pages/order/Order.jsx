import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shopContext';
import Title from '../../components/title/Title';
import axios from 'axios';
import './order.css';

export default function Order() {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) return;
      setIsLoading(true);

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getItemPrice = (item) => {
    if (item.sizes && Array.isArray(item.sizes) && item.size) {
      const matchedSize = item.sizes.find((s) => s.size === item.size);
      if (matchedSize && matchedSize.price) {
        return matchedSize.price;
      }
    }
    return item.price || 0;
  };

  return (
    <div className="order-container">
      <div className="order-title">
        <Title text1={'MES'} text2={'COMMANDES'} />
      </div>

      {isLoading ? (
        // 👉 ICI : contenu affiché pendant le chargement
        <div className="loading-placeholder">
          {/* Option : page vide ou simple texte */}
          <p>Chargement...</p>
        </div>
      ) : orderData.length === 0 ? (
        <div className="no-orders">
          <p>Aucune commande trouvée</p>
          <button onClick={loadOrderData} className="refresh-button">
            Actualiser
          </button>
        </div>
      ) : (
        <div className="order-list">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="order-card"
              style={{
                backgroundColor: item.payment ? '#e6fffa' : '#fff',
                border: item.payment ? '1px solid #38a169' : '1px solid #edf2f7',
              }}
            >
              <div className="order-card-content">
                <img 
                  className="order-img" 
                  src={item.image[0]} 
                  alt={item.name} 
                  loading="lazy"
                />
                <div className="order-info">
                  <p className="order-name">{item.name}</p>
                  <div className="order-meta">
                    <span className="meta-item">
                      <strong>Total:</strong> {getItemPrice(item) * item.quantity} {currency}
                    </span>
                    <span className="meta-item">
                      <strong>Qté:</strong> {item.quantity}
                    </span>
                    <span className="meta-item">
                      <strong>Taille:</strong> {item.size || 'Unique'}
                    </span>
                    <span
                      className="meta-item payment-status"
                      style={{
                        color: item.payment ? '#38a169' : '#e53e3e',
                      }}
                    >
                      <strong>Paiement:</strong> {item.payment ? 'Effectué ✓' : 'En attente'}
                    </span>
                  </div>
                  <p className="order-date">
                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="order-footer">
                <div className="order-status">
                  <span
                    className="status-dot"
                    style={{
                      backgroundColor: 
                        item.status === 'Livré' ? '#38a169' : 
                        item.status === 'Expédié' ? '#3182ce' : 
                        '#dd6b20',
                    }}
                  ></span>
                  <span className="status-text">{item.status}</span>
                </div>
                <button onClick={loadOrderData} className="refresh-button">
                  Actualiser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
