import './sideBar.css'
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const categories = [
  {
    name: 'Vêtements',
    subcategories: ['Homme', 'Femme', 'Enfant'],
  },
  {
    name: 'Électronique',
    subcategories: ['Téléphones', 'Ordinateurs', 'Accessoires'],
  },
  {
    name: 'Chaussures',
    subcategories: ['Sport', 'Ville', 'Sandales'],
  },
];

export default function Sidebar({ setOuvert }) {
  const [visible, setVisible] = useState(null);

  return (
    <div className="sidebar">
      <nav className="category-menu"> 
        {categories.map((cat, index) => (
          <div key={index}>
            <p
              className="category-title"
              style={{fontSize:'20px'}}
              onClick={() => setVisible(visible === index ? null : index)}
            >
              {cat.name}
            </p>

            <div
              className={`subcategory-list ${visible === index ? 'open' : ''}`}
            >
              {visible === index &&
                cat.subcategories.map((sub, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={`/collection/${sub.toLowerCase()}`}
                    onClick={() => setOuvert(false)}
                  >
                    {sub}
                  </NavLink>
                ))
              }
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
