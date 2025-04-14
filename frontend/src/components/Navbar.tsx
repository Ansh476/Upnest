import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCircleUser } from 'react-icons/fa6'

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means "loading"
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/auth/verify-token', {
            credentials: 'include',
          });
  
          if (res.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Auth error:", err);
          setIsAuthenticated(false);
        }
      };
  
      checkAuth();
    }, []);
  
    const handleLogout = async () => {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Debugging cookie removal
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('Token cookie cleared');
      setIsAuthenticated(false);
      navigate('/');
    };

    return (
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#E6EFF0] text-[#203a43] shadow-md">
        <div className="flex items-center space-x-2">
          <Link to="/courses" className="flex items-center space-x-2">
            <img
              src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/xvm38oakt3qeqlvftsby"
              alt="UpNest Logo"
              className="w-10 h-10 object-cover rounded"
            />
            <span className="text-xl font-bold">UpNest</span>
          </Link>
        </div>
        <div className="flex space-x-4">
          {isAuthenticated === null ? (
            <span>Loading...</span> // optional loading state
          ) : !isAuthenticated ? (
            <>
              <Link to="/login" className="px-4 py-2 bg-white text-[#203a43] font-semibold border-2 border-[#203a43] rounded">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-white text-[#203a43] font-semibold border-2 border-[#203a43] rounded">
                Signup
              </Link>
            </>
          ) : (
            <>
              
              <Link to="/mycourses" className="px-4 py-2 bg-white text-[#203a43] font-semibold border-2 border-[#203a43] rounded">
                Mycourses
              </Link>
              <Link to="/hackathons" className="px-4 py-2 bg-white text-[#203a43] font-semibold border-2 border-[#203a43] rounded">
                Hackathons
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-[#203a43] font-semibold border-2 border-[#203a43] rounded"
              >
                Logout
              </button>
              <Link to="/profile">
                <FaCircleUser className="text-[#203a43] text-4xl" />
              </Link>
            </>
          )}
        </div>
      </nav>
    );
  };
  
  export default Navbar;
