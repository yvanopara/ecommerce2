import React, { useContext, useState } from 'react';
import './placeOrder.css';
import Title from '../../components/title/Title';
import CartTotal from '../../components/cartTotal/CartTotal';
import { ShopContext } from '../../context/shopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function PlaceOrder() {
  const { navigate,backendUrl, token, cartItems, getCartAmount, delivery_fee, products,setCartItems  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    city:'',
    phone:'',
    precision:'',
    email:''
  });

  const onchangeHandler =(event)=>{
    const name = event.target.name;
    const value = event.target.value

    setFormData(data => ({...data,[name]:value}))
  } 
  
  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      let orderItems = [];
for (const productId in cartItems) {
  for (const size in cartItems[productId]) {
    if (cartItems[productId][size] > 0) {
      const itemInfo = structuredClone(products.find(product => product._id === productId));
      if (itemInfo) {
        itemInfo.size = size;
        itemInfo.quantity = cartItems[productId][size];
        orderItems.push(itemInfo);
      }
    }
  }
}

      console.log(orderItems)

      let orderData = {
  address: formData,
  items: orderItems, // maintenant c’est bien défini
  amount: getCartAmount() + delivery_fee
};
console.log("ORDER DATA:", orderData);


      const response = await axios.post(backendUrl + "/api/order/place",orderData,{headers:{token}})
      console.log(response.data)
      if (response.data.success) {
        setCartItems({})
        navigate('/orders')
        toast(response.data.message)
      } else {
        toast.error(response.data.message)
        console.log(response.data.message)
      }
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }
  return (
    <form onSubmit={onSubmitHandler} className='place-order-container'>
      <div className='info-section'>
        <div className='title-wrapper'>
          <Title text1={'VOS'} text2={'INFORMATION'} />
        </div>
        <div className='input-group'>
          <input  onChange={onchangeHandler} name='firstName' value={formData.firstName} type='text' placeholder='Nom*' className='input-field' required />
          <input onChange={onchangeHandler} name='lastName' value={formData.lastName} type='text' placeholder='Prenom*' className='input-field' required />
        </div>
        <div className='input-group'>
          <input onChange={onchangeHandler} name='city' value={formData.city} type='text' placeholder='Ville et Quartier*' className='input-field' required />
          <input onChange={onchangeHandler} name='phone' value={formData.phone} type='number' placeholder='Numero de Tel*' className='input-field' required />
        </div>
        <input onChange={onchangeHandler} name='email' value={formData.email} className='input-field' type='email' placeholder='Email(Optionel !)'/>
        <textarea
          className='textarea-field'
          onChange={onchangeHandler} name='precision' value={formData.precision}
          placeholder='Ajouter une précision ?(Optionel !)'
        ></textarea>

      </div>

      <div className='right-section'>
        <div className='cart-wrapper'>
          <CartTotal />
        </div>
        <div className='button-wrapper'>
          <button type='submit'  className='order-button'>COMMANDEZ</button>
        </div>
      </div>
    </form>
  );
}
// onClick={() => navigate('/orders')}