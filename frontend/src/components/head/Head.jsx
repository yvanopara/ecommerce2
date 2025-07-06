import React, { useState, useEffect, useCallback, useRef } from 'react';
import './header.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Slides } from '../../assets/assets';

export default function Header() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const carouselRef = useRef(null);

  // Navigation
  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const newIndex = currentIndex === 0 ? Slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const newIndex = currentIndex === Slides.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  // Gestion du Swipe tactile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const diff = touchStartX - touchEndX;
    const swipeThreshold = 50; // Sensibilité du swipe (en pixels)

    if (diff > swipeThreshold) {
      goToNext(); // Swipe gauche → slide suivante
    } else if (diff < -swipeThreshold) {
      goToPrevious(); // Swipe droite → slide précédente
    }

    // Réinitialise les coordonnées
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div 
      className="header-container"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="slides-container"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {Slides.map((slide, index) => (
          <div 
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img 
              src={slide} 
              alt={`Slide ${index}`} 
              draggable="false" // Empêche le drag d'image
            />
          </div>
        ))}
      </div>
      
      {/* <ChevronLeft className="chevron chev-left" onClick={goToPrevious} size={28} />
      <ChevronRight className="chevron chev-right" onClick={goToNext} size={28} /> */}
    </div>
  );
}