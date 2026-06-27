import React, { useContext } from 'react';
import { ShopContext } from '../../context/shopContext';
import './productItems.css';
import { Link } from 'react-router-dom';

export default function ProductItems({
  slug,
  name,
  image,
  price,
  date
}) {

  const { currency } = useContext(ShopContext);

  // Image tableau/string
  const imageUrl = Array.isArray(image) ? image[0] : image;

  if (!imageUrl) return null;

  // Badge "Nouveau" pendant 12 jours
  const isNew =
    Date.now() - Number(date) <
    12 * 24 * 60 * 60 * 1000;

  return (

    <Link
      to={`/product/${slug}`}
      className="product-item"
    >

      <div className="image-wrapper">

        {isNew && (
          <span className="new-badge">
            Nouveau
          </span>
        )}

        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
        />

      </div>

      <div className="product-info">

        <p className="product-name">
          {name}
        </p>

        <p className="product-price">
          {price} {currency}
        </p>

      </div>

    </Link>

  );
}