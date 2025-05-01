import React from 'react';
import { Link } from 'react-router-dom';
// Assurez-vous que le chemin vers votre CSS est correct
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="stars"></div>
      <div className="home-content">
        {/* Logo de la Maison des Sciences */}
        {/* <div className="logo-container">
          <img src="/images/MSO.png" alt="Logo Maison des Sciences" className="science-logo" />
        </div> */}
        
        <h1 className="title">مرحبًا بك في كود للإنقاذ!</h1>
        <p className="subtitle">استعد لمغامرة مليئة بالألغاز والتحديات</p>
        
        {/* Utilisation de l'image d'ours comme personnage */}
        <div className="character">
          <img src="/images/ours.png" alt="Ours" className="bear-image" />
        </div>
        
        <Link to="/enigma-selection" className="start-button">
          <span>ابدأ المغامرة</span>
          <div className="button-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
        </Link>
      </div>
      <div className="robot"></div>
    </div>
  );
}

export default Home;