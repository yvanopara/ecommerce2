import React, { useEffect, useState } from 'react'
import NavBar from './components/navBar/NavBar'
import SideBar from './components/sideBar/SideBar'
import Add from './pages/add/Add'
import Order from './pages/order/Order'

import { Routes,Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import List from './pages/list/List'
import Login from './components/login/Login'
import { ToastContainer, toast } from 'react-toastify';

// export const backendUrl = 'https://ecommerce2-production-a5f7.up.railway.app'
   export const backendUrl = 'http://localhost:5000'
export const currency = "FCFA"
export default function App() {
  const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'')
  const url = 'https://landry-store.onrender.com'
  
  useEffect(()=>{
    localStorage.setItem('token',token)
  }, [token])
  return (
    <div className=''>
      <ToastContainer/>
      {token === ""? <Login setToken={setToken}/>: 
      <>
      <NavBar setToken={setToken}/>
      <hr/>
      <div className='app-content'>
        <SideBar />
        <Routes>
          <Route path="/add" element={<Add token={token} url={url}/>}/>
          <Route path="/list" element={<List token={token} url={url}/>}/>
          <Route path="/orders" element={<Order token={token} url={url}/>}/>
                    
        </Routes>
      </div>
      </>
      }
      
      
    </div>
  )
}
