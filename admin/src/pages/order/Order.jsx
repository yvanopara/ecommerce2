import React, { useState, useEffect } from 'react';
import './order.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { backendUrl, currency } from '../../App';

export default function Order({ token }) {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      console.log(response.data); // ✅ ceci va maintenant s'afficher
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const statusHandler = async (event,orderId)=>{
    try {
      const response = await axios.post(backendUrl + '/api/order/status',{orderId, status:event.target.value},{headers:{token}})
      if (response.data.success) {
        await fetchAllOrders()
        toast(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.data.message)
    }
  }
  const paymentHandler = async (orderId) => {
  try {
    const response = await axios.post(
      backendUrl + '/api/order/paid',
      { orderId },
      { headers: { token } }
    );
    if (response.data.success) {
      await fetchAllOrders();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors du paiement");
  }
};

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="">
      <h1>Order Page</h1>
      <div>
        {
          orders.map((order, index) => (
            <div className="order-item-row" key={index}>
              <img src={assets.parcel_icon} alt='' />
              <div>
                <div className="items-group">
                  {order.items.map((item, i) => (
                    <p key={i}>{item.name} × {item.quantity} {item.size && <span>({item.size})</span>}</p>
                  ))}<p><strong>Nom:</strong> {order.address.firstName} {order.address.lastName}</p>
                  <p><strong>Quartier:</strong> {order.address.city}</p>
                  <p><strong>Tel:</strong> {order.address.phone}</p>
                  {order.address.email && <p><strong>Email:</strong> {order.address.email}</p>}
                  {order.address.precision && <p><strong>Description:</strong> {order.address.precision}</p>}
                </div>

                <div className="customer-info">

                </div>

                <div className="order-meta">
                  <p><strong>Items:</strong> {order.items.length}</p>
                  <p><strong>Payment:</strong> {order.payment ? "Effectué" : "En attente"}</p>
                  <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> {order.amount}{currency}</p>
                </div>

                <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                  <option value="Commande Reçue">Commande Reçue</option>
                  <option value="Commande en préparation">Commande en préparation</option>
                  <option value="Envoyé">Envoyé</option>
                  <option value="En cours de Livraison">En cours de Livraison</option>
                  <option value="Livré">Livré</option>
                </select>
                <button onClick={() => paymentHandler(order._id)}>paye</button>

              </div>
            </div>

          ))
        }
      </div>
      {/* 
      <div className="order-list">
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className="order-item">

            <div className='order-item-details'>
            <img src={assets.parcel_icon} alt="Parcel Icon"/>
              <p className="order-item-food" >
                {order.items?.map((item, index) => {
                  return index === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `;
                })}
              </p>
              <p >{order.amount} FCFA</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Deliver</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className='order-item-details-user'>

            <p className="order-item-name" > {order.address.firstName + " " + order.address.lastName} </p>
            
            <p className='order-item-address' >{order.address.street + ","+order.address.country}</p>
      
            <p className='order-item-phone'  >{order.address.phone}</p>

            </div>

          </div>

        ))}
      </div> */}
    </div>
  );
}
