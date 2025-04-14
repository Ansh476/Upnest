// src/pages/Hackathons.tsx

import React from 'react';
import HackathonCard from '../components/HackathonCard';
import hackathonData from '../data/hackathons.json';

const Hackathons: React.FC = () => {
  return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Apps to Explore</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {hackathonData.appsToExplore.map((app, index) => (
            <HackathonCard
              key={`app-${index}`}
              title={app.name}
              imageUrl={app.imageUrl}
              link={app.link}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Odd Sem Hackathons</h2>
        <div className="grid grid-cols-3 gap-4">
          {hackathonData.oddSemHackathons.map((hack, index) => (
            <HackathonCard
              key={`odd-${index}`}
              title={hack.name}
              imageUrl={hack.imageUrl}
              link={hack.viewDetails}
            />
          ))}
        </div>
        
        <h2 className="text-2xl font-bold mb-4 mt-6">Even Sem Hackathons</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {hackathonData.evenSemHackathons.map((hack, index) => (
            <HackathonCard
              key={`even-${index}`}
              title={hack.name}
              imageUrl={hack.imageUrl}
              link={hack.viewDetails}
            />
          ))}
        </div>
      </div>
  );
};

export default Hackathons;
