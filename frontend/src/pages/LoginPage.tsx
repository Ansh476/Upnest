import React, { useState } from 'react';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.message === 'Login successful') {
        // Optionally: store auth state globally or in context
        window.location.href = '/courses';
      } else {
        alert(response.data.message || "Invalid credentials.");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="p-8 rounded shadow-lg border-2 border-[#E6EFF0]  w-full max-w-md ">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-white">Login</h1>
  
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="mb-3 p-2 border border-[#E6EFF0]  rounded w-full text-[#E6EFF0] "
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="mb-4 p-2 border border-[#E6EFF0]  rounded w-full text-[#E6EFF0] "
          />
  
          <button 
            onClick={handleLogin} 
            className="px-6 py-2 bg-[#E6EFF0] text-[#203a43] font-semibold rounded hover:bg-[#d3e0e2] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
