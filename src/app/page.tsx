import React from 'react';
import PacManGame from '../components/PacManGame';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-900">
      <PacManGame />
    </main>
  );
};

export default HomePage;
