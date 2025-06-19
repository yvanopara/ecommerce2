import React from 'react';
import './title.css'; // le fichier CSS

const Title = ({ text1, text2 }) => {
  return (
    <div className="title">
      <p className="my-text">{text1}</p>
      <p className="my-bar">{text2}</p>
    </div>
  );
};

export default Title;
