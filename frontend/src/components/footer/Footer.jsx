import React from 'react'
import './footer.css' 
import { assets } from '../../assets/assets'
import '@fontsource/saira-stencil-one'; // This font has only one weight (400)

export default function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            
            <div className='footer-content-left'>
                {/* <img src={assets.logo} alt=''/> */}
                <h1 className='logoName'>K-MyStore</h1>
                <p style={{marginTop:"-30px"}}>Contact Us Via Our Social Media</p>
                <div className='footer-social-icon'>
                    <img src={assets.facebook_icon} alt=''/>
                    <img src={assets.twitter_icon} alt=''/>
                    <img src={assets.linkedin_icon} alt=''/>
                </div>

            </div>

            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    {/* <li>About Us</li>
                    <li>Privacy Policy</li> */}

                </ul>
                
            </div>

            <div className='footer-content-right'>
                <h2>Get In Touch</h2>
                <ul>
                    <li>237693800251</li>
                    <li>yvanlandry4000@gmail.com</li>

                </ul>
                
            </div>
           
           
        </div>

        <hr/>
<p className='footer-copiright'>Copyright 2024 @ k-mystore.com - All Right Reserve. </p>

    </div>
  )
}
