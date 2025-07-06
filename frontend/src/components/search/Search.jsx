import React, { useContext } from 'react'
import { ShopContext } from '../../context/shopContext'
import { assets } from '../../assets/assets'
import './search.css'

export default function Search() {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)

  return showSearch ? (
    <div className="search-container">
      <div className="search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          type="text"
          placeholder="Search..."
        />
        <img className="search-icon" src={assets.search_icon} alt="search" />
      </div>
      <img
        onClick={()=>setShowSearch(false)}
        className="close-icon"
        src={assets.cross_icon}
        alt="close"
      />
    </div>

  ) : null
}
