import React from 'react';
import './about.css';
import { assets } from '../../assets/assets';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <div className="profile-image-container">
          <img src={assets.profile} alt="Photo de profil" className="profile-image" />

        </div>
        <div className="about-content">
          <div className="about-subtitle">À propos de moi</div>
          <h1 className="about-title">Bonjour, je suis Yvan Opara</h1>
          
          <div className="about-text">
  <p>
    Je suis ingénieur logiciel passionné et entrepreneur dans le domaine de l’import-export. Depuis plusieurs années, je développe mon expertise dans deux secteurs complémentaires : la conception de solutions logicielles innovantes et le commerce international avec des partenaires en Chine, aux États-Unis, en Turquie et au Nigéria.
  </p>
  <p>
    Après mes études secondaires au Collège Bilingue Orchidée à Douala, couronnées par l’obtention de mon GCE Advanced Level en Sciences, j’ai poursuivi mes études supérieures à l’Université de Buea (College of Technology) où j’ai validé un BTS en ingénierie logicielle. J’ai ensuite consolidé mon parcours académique en obtenant en 2024 un Bachelor Degree en Software Engineering à Landmark Metropolitan University.
  </p>
  <p>
    Ma passion pour la technologie m’a conduit à initier dès ma deuxième année universitaire le projet <strong>K-MyStore</strong>, une plateforme e-commerce ambitieuse que j’ai conçue de A à Z. La première version a vu le jour en novembre 2024 et la version 2 a été développée entre janvier et juin 2025, avec pour objectif de proposer une plateforme robuste, évolutive et dotée d’une interface UI/UX moderne et performante.
  </p>
  <p>
    Pour garantir la qualité technique du projet, j’ai mobilisé des technologies fiables et actuelles : ReactJS, JavaScript, HTML, CSS, Node.js, Express, MongoDB, Redux, ainsi que Material.IO pour l’interface utilisateur. Grâce à cette stack technologique, j’ai pu concevoir une architecture sécurisée et évolutive répondant aux standards du marché.
  </p>
  <p>
    Fort de cette expérience, je mets aujourd’hui mes compétences au service de projets numériques innovants, alliant rigueur, créativité et sens du détail. Mon objectif est de contribuer à des solutions à forte valeur ajoutée, qu’il s’agisse de développement web, de gestion de bases de données ou de conception d’interfaces utilisateur performantes.
  </p>
  <p>
    Parallèlement, mon activité dans l’import-export me permet de renforcer mes qualités de gestionnaire et de négociateur, avec une compréhension concrète des enjeux commerciaux et logistiques à l’international.
  </p>
  <p>
    Ouvert aux collaborations, je reste à l’écoute de nouvelles opportunités pour mettre mon savoir-faire technique et ma vision entrepreneuriale au service de projets ambitieux et porteurs d’impact.
  </p>
</div>

          
          {/* <div className="skills-section">
            <h3>Mes compétences clés</h3>
            <div className="skills-container">
              {['React', 'Design', 'UX/UI', 'JavaScript', 'HTML/CSS'].map((skill) => (
                <span key={skill} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}