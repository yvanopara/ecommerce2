import './sideBar.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const categories = [
  { name: 'Vêtements', subcategories: ['Homme', 'Femme', 'Enfant'] },
  { name: 'Électronique', subcategories: ['Téléphones', 'Ordinateurs', 'Accessoires'] },
  { name: 'Chaussures', subcategories: ['Sport', 'Ville', 'Sandales'] },
];

export default function Sidebar({ setOuvert }) {
  const [visible, setVisible] = useState(null);

  return (
    <div className="sidebar">
      <nav className="category-menu">
        {categories.map((cat, index) => (
          <div key={index} className="category-block">
            <div
              className="category-title"
              onClick={() => setVisible(visible === index ? null : index)}
            >
              <span>{cat.name}</span>
              {visible === index ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            </div>

            <div className={`subcategory-list ${visible === index ? 'open' : ''}`}>
              {cat.subcategories.map((sub, subIndex) => (
                <NavLink
                  key={subIndex}
                  to={`/collection/${sub.toLowerCase()}`}
                  onClick={() => setOuvert(false)}
                >
                  {sub}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
