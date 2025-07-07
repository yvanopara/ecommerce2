import React from 'react';
// import { profile } from '../../assets/asset';


import './about.css';


export default function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <div className="profile-image-container">
          {/* <img 
            src={profile} 
            alt="Profile" 
            className="profile-image"
          /> */}
        </div>
        <div className="about-content">
          <div className="about-subtitle">À propos de moi</div>
          <h1 className="about-title">Bonjour, je suis [Votre Nom]</h1>
          
          <div className="about-text">
            <p>
              Passionné(e) par [vos domaines d'intérêt], je mets mon expertise au service de projets innovants.
            </p>
            <p>
              Avec [nombre] années d'expérience dans [votre domaine], j'ai développé des compétences solides.
            </p>
            <p>
              Mon approche allie rigueur méthodologique et créativité pour offrir des solutions adaptées.
            </p>
          </div>
          
          <div className="skills-section">
            <h3>Mes compétences clés</h3>
            <div className="skills-container">
              {['React', 'Design', 'UX/UI', 'JavaScript', 'HTML/CSS'].map((skill) => (
                <span key={skill} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}