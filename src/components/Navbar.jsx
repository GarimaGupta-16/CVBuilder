import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
          isActive 
            ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' 
            : 'text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-gradient flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          Resume<span className="font-light text-gray-800 dark:text-white">AI</span>
        </Link>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center space-x-2 mr-4">
            <NavLink to="/">Home</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/ats">ATS Check</NavLink>
                <NavLink to="/interview">Mock Interview</NavLink>
              </>
            )}
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2 hidden sm:block"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-800 dark:text-white font-bold hidden sm:block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm shadow-inner">
                {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-bold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-gray-800 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Log In</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
