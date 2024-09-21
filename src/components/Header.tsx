// src/components/Header.tsx
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <div className="header">
      <img
        src="https://www.comune.catania.it/data/logo/Comune-di-catania.jpg"
        alt="Logo"
        className="logo"
      />
      <h1>Poc - Assistente digitale</h1>
    </div>
  );
};

export default Header;
