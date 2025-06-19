import './sideBar.css'
import {assets} from '../../assets/assets'

import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SideBar() {
  return (
    <div className='sideBar'>
        <div className="sideBar-options">
            <NavLink to="/add" className="sideBar-option">
                <img  src={assets.add_icon} alt="" />
                <p>Add Items</p>
            </NavLink>

            <NavLink to="/list" className="sideBar-option">
                <img src={assets.order_icon} alt="bag_icon" />
                <p>List Items</p>
            </NavLink>

            <NavLink to="/orders" className="sideBar-option">
                <img src={assets.order_icon} alt="bag_icon" />
                <p>Orders</p>
            </NavLink>
        </div>
      
    </div>
  )
}  