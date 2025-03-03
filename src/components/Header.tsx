// src/components/Header.tsx
import React from 'react';
import { cn } from '../lib/utils';

const Header: React.FC = () => {
  return (
    <header className="flex items-center px-6 py-3 bg-card border-b">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Provincia_di_Catania-Stemma.svg/806px-Provincia_di_Catania-Stemma.svg.png"
        alt="Logo"
        className="h-10 mr-4"
      />
      <h1 className="text-2xl font-light">Poc - Assistente digitale</h1>
    </header>
  );
};

export default Header;
