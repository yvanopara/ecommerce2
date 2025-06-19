import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shopContext';
import Title from '../../components/title/Title';
import { products } from '../../assets/assets';
import './order.css';
import axios from 'axios';

export default function Order() {
    const { backendUrl, token, currency } = useContext(ShopContext);

    const [orderData, setOrderData] = useState([]);

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.post(
                backendUrl + '/api/order/userorders',
                {},
                { headers: { token } }
            );

            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
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
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    return (
        <div className="order-container">
            <div className="order-title">
                <Title text1={'MES'} text2={'COMMANDES'} />
            </div>

            <div className="order-list">
                {orderData.map((item, index) => (
                    <div key={index} className="order-card">
                        <div className="order-card-content">
                            <img className="order-img" src={item.image[0]} alt={item.name} />
                            <div className="order-info">
                                <p className="order-name">{item.name}</p>
                                <div className="order-meta">
                                    <span>Total: {item.price * item.quantity} {currency}</span>
                                    <span>Quantité: {item.quantity}</span>
                                    <span>Taille: {item.size}</span>
                                    <span
                                        style={{
                                            color: item.payment ? 'green' : 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Paiement: {item.payment ? 'Effectué' : 'En attente'}
                                    </span>
                                </div>
                                <p className="order-date">
                                    Date: <span>{new Date(item.date).toDateString()}</span>
                                </p>
                            </div>
                        </div>

                        <div className="order-footer">
                            <div className="order-status">
                                <span
                                    className="status-dot"
                                    style={{
                                        backgroundColor: item.status === 'Livré' ? 'green' : '#ffa500',
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
        </div>
    );
}
