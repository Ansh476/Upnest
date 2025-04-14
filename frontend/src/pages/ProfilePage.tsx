import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    dob: '',
    skills: ''
  });
  const [updatedData, setUpdatedData] = useState({ ...profileData });

  // Fetch profile details on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          withCredentials: true
        });
        setProfileData(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        alert("Failed to load profile data");
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/user/profile/update', updatedData, {
        withCredentials: true
      });
      alert(response.data.message);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="p-8 rounded shadow-lg border-2 border-[#E6EFF0] w-full max-w-md">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-white">Profile</h1>

          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleChange}
            className="mb-3 p-2 border border-[#E6EFF0] rounded w-full text-[#E6EFF0] bg-transparent"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={updatedData.email}
            disabled
            className="mb-3 p-2 border border-[#E6EFF0] rounded w-full text-[#E6EFF0] bg-gray-600 cursor-not-allowed"
            placeholder="Email"
          />
          <input
            type="tel"
            name="phone"
            value={updatedData.phone}
            onChange={handleChange}
            className="mb-3 p-2 border border-[#E6EFF0] rounded w-full text-[#E6EFF0] bg-transparent"
            placeholder="Phone"
          />
          <select
            name="gender"
            value={updatedData.gender}
            onChange={handleChange}
            className="mb-3 p-2 border border-[#E6EFF0] rounded w-full text-[#E6EFF0] bg-transparent"
          >
            <option value="male" className="bg-[#203a43] text-white">Male</option>
            <option value="female" className="bg-[#203a43] text-white">Female</option>
          </select>
          <input
            type="date"
            name="dob"
            value={updatedData.dob}
            onChange={handleChange}
            className="mb-3 p-2 border border-[#E6EFF0] rounded w-full text-[#E6EFF0] bg-transparent"
          />
          <input
            type="text"
            name="skills"
            value={updatedData.skills}
            onChange={handleChange}
            className="mb-4 p-2 border border-[#E6EFF0] rounded w-full text-[#E6EFF0] bg-transparent"
            placeholder="Skills"
          />

          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-[#E6EFF0] text-[#203a43] font-semibold rounded hover:bg-[#d3e0e2]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
