import './sideBar.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// ✅ Catégories normalisées
const categories = [
  {
    name: 'Femme',
    subcategories: [
      { value: 'produit-de-beaute', label: 'Produit de beauté' },
      { value: 'sac-a-main', label: 'Sac à main' },
      { value: 'mode', label: 'Mode' },
      { value: 'bijoux', label: 'Bijoux' },
      { value: 'voir-plus', label: 'Voir plus' },
      
    ]
  },
  {
    name: 'Enfant',
    subcategories: [
      { value: 'jouets', label: 'Jouets' },
      { value: 'voir-plus', label: 'Voir plus' },
      
    ]
  },
  {
    name: 'Parfum',
    subcategories: [
      { value: 'femmes', label: 'Femmes' },
      { value: 'hommes', label: 'Hommes' },
    
    ]
  },
  {
    name: 'Electronique',
    subcategories: [
      { value: 'electromenagers', label: 'Électroménager' },
     { value: 'voir-plus', label: 'Voir plus' },
    ]
  },
{
    name: 'Arts',
    subcategories: [
      { value: 'passion', label: 'Crayon & Passion' },
    ]
  },
  {
    name: 'Maison',
    subcategories: [
      { value: 'maisons', label: 'Voir plus' },
    ]
  },
  {
    name: 'Services',
    subcategories: [
      { value: 'patisserie', label: 'Pâtisserie ' },
    ]
  },
  // {
  //   name: 'Informatique',
  //   subcategories: [
  //     { value: 'voir-pluss', label: 'Voir plus' },
  //   ]
  // },
  {
    name: 'Chicha Electronique',
    subcategories: [
      { value: 'chichas', label: 'Voir plus' },
    ]
  },
  {
    name: 'Adult',
    subcategories: [
      { value: 'produits-adultes', label: 'Produits Adults' },
    ]
  }
];

export default function Sidebar({ setOuvert }) {
  const [visible, setVisible] = useState(null);

  return (
    <div className="sidebar">
      <div className="sidebar-content">
      <nav className="category-menu">
        {categories.map((cat, index) => (
          <div key={index} className="category-block">
            <div
              className="category-title"
              onClick={() => setVisible(visible === index ? null : index)}
            >
              <span>{cat.name}</span>
              {visible === index ? (
                <FaChevronUp size={16} />
              ) : (
                <FaChevronDown size={16} />
              )}
            </div>

            <div className={`subcategory-list ${visible === index ? 'open' : ''}`}>
              {cat.subcategories.map((sub, subIndex) => (
                <NavLink
                  key={subIndex}
                  to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}/subcategory/${sub.value}`}


                  onClick={() => setOuvert(false)}
                >
                  {sub.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      </div>
    </div>
  );
}
