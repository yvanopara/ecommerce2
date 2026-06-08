import React, { useEffect, useState } from 'react'
import NavBar from './components/navBar/NavBar'
import SideBar from './components/sideBar/SideBar'
import Add from './pages/add/Add'
import Video from './pages/video/Video'
import Order from './pages/order/Order'


import { Routes,Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import List from './pages/list/List'
import Login from './components/login/Login'
import { ToastContainer, toast } from 'react-toastify';
import Messages from './pages/messages/Messages'
import EditProduct from './pages/editProduct/EditProduct'


// export const backendUrl = 'http://localhost:5000'
 export const backendUrl = 'https://ecommerce2-4jwd.onrender.com' 
  // export const backendUrl = 'https://backend2-58eq.onrender.com' 
   

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
          <Route path="/video" element={<Video token={token} />}/>
           <Route path="/message" element={<Messages token={token} />}/>
           <Route path="/edit-product/:id" element={<EditProduct token={token} />}/>
         
                    
        </Routes>
      </div>
      </>
      }
      
      
    </div>
  )
}
