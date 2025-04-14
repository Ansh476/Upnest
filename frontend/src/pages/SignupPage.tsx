import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    dob: '',
    skills: ''
  });
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()) // convert to array
      });

      alert(response.data.message);
      setShowOtpField(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpResponse = await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        {
          email: formData.email,
          otp
        },
        {
          withCredentials: true // ✅ to accept and store HTTP-only cookie
        }
      );

      alert(otpResponse.data.message);

      // ✅ Step 2: Verify token with backend
      const tokenCheck = await axios.get('http://localhost:5000/api/auth/verify-token', {
        withCredentials: true
      });

      if (tokenCheck.data.valid) {
        // ✅ Token is valid, navigate to home
        navigate('/courses');
      } else {
        alert('Token not valid. Please login again.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Signup</h1>
      <input 
        type="text" 
        placeholder="Name" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <input 
        type="email" 
        placeholder="Email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <input 
        type="password" 
        placeholder="Password" 
        name="password" 
        value={formData.password} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <input 
        type="tel" 
        placeholder="Phone" 
        name="phone" 
        value={formData.phone} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <select 
        name="gender" 
        value={formData.gender} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input 
        type="date" 
        name="dob" 
        value={formData.dob} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <input 
        type="text" 
        name="skills" 
        placeholder="Skills (comma separated)" 
        value={formData.skills} 
        onChange={handleChange} 
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <button 
        onClick={handleSignup} 
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Signup
      </button>

      {showOtpField && (
        <>
          <input 
            type="text" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            className="mb-4 p-2 border rounded w-full max-w-xs"
          />
          <button 
            onClick={handleVerifyOtp} 
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default SignupPage;
