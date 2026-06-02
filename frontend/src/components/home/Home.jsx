
import React, {
  useContext,
  useEffect
} from 'react';

import {
  Helmet
} from 'react-helmet-async';

import Head from '../head/Head';
import LatestCollections from '../latestCollection/LatestCollections';
import BestSeller from '../bestSeller/BestSeller';
import HomePageCategory from '../../pages/homePageCategory/HomePageCategory';

import {
  ShopContext
} from '../../context/shopContext';

import axios from 'axios';

export default function Home() {

  const {
    backendUrl,
    token
  } = useContext(
    ShopContext
  );


  useEffect(() => {

    const notifyVisit =
      async () => {

        let message =
          "Un visiteur inconnu vient de visiter la page d'accueil.";

        if (token) {

          try {

            const response =
              await axios.get(
                `${backendUrl}/api/user/profile`,
                {
                  headers: {
                    token
                  }
                }
              );

            if (
              response.data
                .success
            ) {

              const user =
                response.data
                  .user;

              message =
                `L'utilisateur *${user.name} (${user.email})* est en train de visiter la page d'accueil.`;
            }

          } catch (
          error
          ) {

            console.error(
              "Erreur lors de la récupération du profil :",
              error
            );
          }
        }

        try {

          await axios.post(
            `${backendUrl}/notify`,
            { message },
            {
              headers: {
                'Content-Type':
                  'application/json',
                token:
                  token || '',
              },
            }
          );

        } catch (
        error
        ) {

          console.error(
            "Erreur lors de l'envoi de la notification :",
            error
          );
        }
      };

    notifyVisit();

  }, [
    token,
    backendUrl
  ]);


  return (
    <>

      {/* SEO HOME */}
      <Helmet>

        <title>
          K-Mystore |
          Lingerie,
          Bien-être intime,
          Beauté &
          Parfums au Cameroun
        </title>

        <meta
          name="description"
          content="
Découvrez lingerie, produits de bien-être intime, parfums, produits de beauté et accessoires lifestyle sur K-Mystore. Livraison discrète et rapide au Cameroun."
        />

        <meta
          name="keywords"
          content="
lingerie Cameroun,
boutique intime Cameroun,
produits bien-être intime Cameroun,
parfums Cameroun,
produits beauté Cameroun,
sextoys Cameroun,
accessoires couple,
livraison discrète Cameroun,
K-Mystore
"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="
K-Mystore | Lingerie, Bien-être intime, Beauté & Parfums au Cameroun
"
        />

        <meta
          property="og:description"
          content="
Découvrez lingerie, bien-être intime, parfums et produits beauté avec livraison discrète sur K-Mystore.
"
        />

        <meta
          property="og:type"
          content="website"
        />

      </Helmet>


      <div>

        <Head />

        <LatestCollections />

        <HomePageCategory />

        <BestSeller />

      </div>

    </>
  );
}
