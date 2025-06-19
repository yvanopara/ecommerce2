import React, { useState } from 'react'
import './login.css'
import axios from 'axios';
import {backendUrl} from '../../App';
import {toast} from 'react-toastify';

export default function Login({setToken}) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const onSubmitHandler = async (e) =>{
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl+'/api/user/admin',{email,password})
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(response.data.message)
        }
    }

  return (
    <div className="container">
        
      <div className="card">
        <h1 className="title">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="input-group">
            <p className="label">Email Address</p>
            <input className="input" onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Enter email" required />
          </div>

          <div className="input-group">
            <p className="label">Password</p>
            <input className="input" onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Enter password" required />
          </div>

          <button className="button">Login</button>
        </form>
      </div>
    </div>
  )
}
