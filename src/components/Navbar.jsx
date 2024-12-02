/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { logout } from '../redux/reducers/user/authSlice';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import logo from '../../assets/monis_logo1.png'
import logo from '../assets/monis_logo1.png'

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsOpen(false); 
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-[#eb671c] text-white p-4 fixed w-full z-10 top-0 left-0 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src={logo} // Replace with the actual path to your logo
              alt="Monis Foods Logo"
              className="h-12 w-12"
            />
            <span className="text-2xl font-semibold">Monis Foods</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="hover:text-gray-300">Home</Link>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                <Link to="/wallet" className="hover:text-gray-300">Wallet</Link>
                <Link to="/bookings" className="hover:text-gray-300">Bookings</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } lg:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 shadow-lg`}
        >
          <ul className="space-y-4 text-center">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/home" className="block text-xl py-2 hover:bg-gray-700 rounded" onClick={closeMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="block text-xl py-2 hover:bg-gray-700 rounded" onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/wallet" className="block text-xl py-2 hover:bg-gray-700 rounded" onClick={closeMenu}>
                    Wallet
                  </Link>
                </li>
                <li>
                  <Link to="/bookings" className="block text-xl py-2 hover:bg-gray-700 rounded" onClick={closeMenu}>
                    Bookings
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-xl py-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="block text-xl py-2 hover:bg-gray-700 rounded" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block text-xl py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
