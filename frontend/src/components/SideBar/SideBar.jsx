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
              onClick={() => setVisible(visible === index ? null : index)}
            >
              {cat.name}
            </p>

            {visible === index && (
              <div className="subcategory-list">
                {cat.subcategories.map((sub, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={`/collection/${cat.name.toLowerCase()}/${sub.toLowerCase()}`}
                    onClick={() => setOuvert(false)}
                  >
                    {sub}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
