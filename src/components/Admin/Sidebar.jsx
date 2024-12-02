import { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import logo from '../../assets/monis_logo1.png'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/user/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for dropdown visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the dropdown menu
  };


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsOpen(false); 
  };
  return (
    <div>
      <div className="fixed top-4 left-4 z-20 md:hidden">
        <button onClick={toggleSidebar} className="text-2xl text-black">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#320e0e] text-white z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64`}
      >
        <div className="flex flex-col items-center py-4">
    {/* Logo */}
    <img
      src={logo}
      alt="Admin Panel Logo"
      className="w-24 h-24 object-contain"
    />
    {/* Panel Title */}
    <h2 className="text-2xl font-bold mt-2">Admin Panel</h2>
  </div>
        <nav className="flex-grow overflow-y-auto"> {/* Allow scrolling if content overflows */}
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Users
              </Link>
            </li>
            {/* <li>
              <Link
                to="/admin/revenue"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Revenue
              </Link>
            </li> */}
            <li>
              <Link
                to="/admin/bookings"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Bookings
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={toggleMenu}
                className="block px-4 py-2 w-full text-left hover:bg-gray-700 flex items-center justify-between"
              >
                Menus
                <FaChevronDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMenuOpen && (
                <ul className="absolute left-0 mt-2 w-full bg-[#eb671c] rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto min-h-[150px]"> {/* Adjust dropdown size */}
                  <li>
                    <Link
                      to="/admin/menus/view"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      View Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/menus/add"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Add Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/menus/edit"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Edit Menu
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* <li>
              <Link
                to="/admin/view-menus"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                View Menus
              </Link>
            </li> */}
            <li>
              <Link
                to="/admin/items"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Items
              </Link>
            </li>
            <li>
              <Link
                to="/admin/coupons"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Coupons
              </Link>
            </li>
            {/* <li>
              <Link
                to="/admin/transactions"
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Transactions
              </Link>
            </li> */}
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
