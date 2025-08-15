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
      // Message par défaut
      let message = "Un visiteur inconnu vient de visiter la page d'accueil.";

      // Si on a un token, on essaie d'enrichir le message
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { token },
          });

          if (response.data.success) {
            const user = response.data.user;
            message = `L'utilisateur *${user.name} (${user.email})* est en train de visiter la page d'accueil.`;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du profil :", error);
        }
      }

      // On envoie le message au backend ou au mini serveur
      try {
        await axios.post("http://localhost:5000/notify", 
          { message }, 
          {
            headers: {
              'Content-Type': 'application/json',
              token: token || '',
            },
          }
        );
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error);
      }
    };

    notifyVisit();
  }, [token, backendUrl]);

  return (
    <div>
      <Head />
      <LatestCollections />
      <HomePageCategory />
      <BestSeller />
    </div>
  );
}
