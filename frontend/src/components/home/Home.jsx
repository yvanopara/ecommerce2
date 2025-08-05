import React, { useContext, useEffect } from 'react';
import Head from '../head/Head';
import LatestCollections from '../latestCollection/LatestCollections';
import BestSeller from '../bestSeller/BestSeller';
import HomePageCategory from '../../pages/homePageCategory/HomePageCategory';
import { ShopContext } from '../../context/shopContext';
import axios from 'axios';

export default function Home() {
  const { backendUrl, token } = useContext(ShopContext);

  useEffect(() => {
  const notifyVisit = async () => {
    let message = "Un visiteur inconnu vient de visiter la page d'accueil.";

    if (token) {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });

        if (response.data.success) {
          const user = response.data.user;
          message = `L'utilisateur *${user.name} ${user.email}* est en train de visiter la page d'accueil.`;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    }

    try {
      await axios.post(`${backendUrl}/api/notify`, { message }, {
        headers: {
          'Content-Type': 'application/json',
          token: token || '', // Si besoin d’authentifier l’appel
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification :", error);
    }
  };

  notifyVisit();
}, [token]);


  return (
    <div>
      <Head />
      <LatestCollections />
      <HomePageCategory />
      <BestSeller />
    </div>
  );
}
