// src/components/HackathonCard.tsx

import React from 'react';

interface HackathonCardProps {
  title: string;
  imageUrl: string;
  link: string;
  type?: string; // optional, used only for Apps to Explore
}

const HackathonCard: React.FC<HackathonCardProps> = ({ title, imageUrl, link, type }) => {
  return (
    <div className="border rounded shadow-md p-4">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded" />
      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      {type && <p className="text-sm text-gray-600">{type}</p>}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-4 py-2 bg-[#E6EFF0] text-[#203a43] rounded"
      >
        View Details
      </a>
    </div>
  );
};

export default HackathonCard;
