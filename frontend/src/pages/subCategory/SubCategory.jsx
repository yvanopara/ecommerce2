import React, { useContext, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/shopContext';

import ProductItems from '../../components/productItems/ProductItems';
import Title from '../../components/title/Title';
import axios from 'axios';

export default function SubCategory() {
  const { category, subcategory } = useParams();
  const { products, backendUrl, token } = useContext(ShopContext);

  // ------------------------------
  // Envoie un message au backend
  // ------------------------------
  const notifyVisit = async () => {
    let message = `Un visiteur inconnu visite la sous-catégorie "${subcategory}".`;

    // Si on a un token, on enrichit le message avec le nom/email
    if (token) {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });
        if (response.data.success) {
          const user = response.data.user;
          message = `L'utilisateur *${user.name} (${user.email})* visite la sous-catégorie "${subcategory}".`;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil pour notification :", error);
      }
    }

    // Envoi au backend
    try {
      await axios.post(`${backendUrl}/notify`, { message }, {
        headers: {
          'Content-Type': 'application/json',
          token: token || '',
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification :", error);
    }
  };

  useEffect(() => {
    notifyVisit();
  }, [subcategory, token, backendUrl]);

  // ------------------------------
  // Filtrage et mélange des produits
  // ------------------------------
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const filtered = products.filter(
      (product) =>
        product.subCategory?.toLowerCase() === subcategory?.toLowerCase()
    );
    return filtered.sort(() => Math.random() - 0.5);
  }, [products, subcategory]);

  return (
    <div className="category-page-container">
      <div className="title-wrapper">
        <Title text1={subcategory?.toUpperCase()} text2={'COLLECTION'} />
      </div>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => {

          console.log(
    "SUBCATEGORY PRODUCT",
    item.name,
    item.slug
  );
  
            const price =
              Array.isArray(item.sizes) && item.sizes.length > 0
                ? item.sizes[0].price
                : item.price;

            return (
              <div className="product-item-wrapper" key={item._id}>
                <ProductItems 
                slug={item.slug}
                 name={item.name}
                  image={item.image}
                   price={price}
                    className="centered-product-item"
                     />
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center' }}>
            Chargement des Produits Patientez SVP!
          </p>
        )}
      </div>
    </div>
  );
}
