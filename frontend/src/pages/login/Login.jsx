import React, { useContext, useEffect, useState } from 'react';
import './login.css';
import { ShopContext } from '../../context/shopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Login() {
    const [currentSate, setCurrentSatete] = useState('Connection');
    const {token, setToken, navigate,backendUrl} = useContext(ShopContext)
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    
    
    const onSubmitHandler = async(event) => {
        event.preventDefault();
        try {
            if (currentSate === 'Creez Un Compte') {
                const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                    toast('Votre compte a ete cree avec Success !')
                } else {
                     toast.error(response.data.message)
                }
            } else {
                const response = await axios.post(backendUrl + '/api/user/login', {email,password})
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                    toast('Connection Reussie !')
                } else {
                    toast.error(response.data.message)
                }
                
                console.log(response.data)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    useEffect(()=>{
        if (token) {
            navigate('/')
            
        }
    })

    return (
        <form onSubmit={onSubmitHandler} className='login-form'>
            <div className='login-title'>
                <p className='login-heading'>{currentSate}</p>
            </div>
            {currentSate === 'Connection' ? '' :
                <input onChange={(e)=>setName(e.target.value)} value={name} type='text' className='login-input' placeholder='Name' required />
            }
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' className='login-input' placeholder='Email' required />
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type='password' className='login-input' placeholder='Password' required />

            <div className='login-footer'>
                <p className='login-link'>Mot de Passe Oublier?</p>
                {
                    currentSate === 'Connection'
                        ? <p className='login-link' onClick={() => setCurrentSatete('Creez un compte')}>Creez un compte</p>
                        : <p className='login-link' onClick={() => setCurrentSatete('Connection')}>Connectez vous ici</p>
                }
            </div>
            <button className='login-button'>
                {currentSate === 'Connection' ? 'connectez vous' : 'Creez un compte'}
            </button>
        </form>
    );
}
