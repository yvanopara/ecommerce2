import React, { useState, useEffect } from 'react';
import './header.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Slides } from '../../assets/assets';

export default function Header() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? Slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === Slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === Slides.length - 1 ? 0 : prevIndex + 1));
    }, 3000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentIndex]);

  return (
    <div className="header">
        
      <img src={Slides[currentIndex]} alt={`Slide ${currentIndex}`} />
      <ChevronLeft className="chev-left" onClick={goToPrevious} />
      <ChevronRight className="chev-right" onClick={goToNext} />
      <div className="dotIndicator">
        {Slides.map((_, slideIndex) => (
          <div key={slideIndex}>
            <p>.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
