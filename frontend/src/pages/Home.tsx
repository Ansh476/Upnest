import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHomepage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-token', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        navigate('/courses');
      } else {
        alert('Please login or signup first!');
      }
    } catch (error) {
      alert('Please login or signup first!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen  px-4">
      <div className="text-center">
        <h1 className="text-white text-6xl font-extrabold mb-4">Welcome to UpNest</h1>
        <p className="text-white text-lg mb-6">
          Discover new skills, explore trending tech, and participate in exciting hackathons — all in one place.
        </p>
        <button
          onClick={handleGoToHomepage}
          className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-xl shadow-md hover:bg-blue-100 transition-all"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Home;
