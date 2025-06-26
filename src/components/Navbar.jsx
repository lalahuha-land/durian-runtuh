import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-durian-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Durian fruit body */}
                <ellipse cx="32" cy="40" rx="20" ry="16" fill="#007852"/>
                
                {/* Durian spikes */}
                <path d="M12 40 L16 35 L20 40 L24 35 L28 40 L32 35 L36 40 L40 35 L44 40 L48 35 L52 40" stroke="#01AF5E" stroke-width="2" fill="none"/>
                <path d="M12 36 L16 31 L20 36 L24 31 L28 36 L32 31 L36 36 L40 31 L44 36 L48 31 L52 36" stroke="#01AF5E" stroke-width="2" fill="none"/>
                <path d="M12 44 L16 39 L20 44 L24 39 L28 44 L32 39 L36 44 L40 39 L44 44 L48 39 L52 44" stroke="#01AF5E" stroke-width="2" fill="none"/>
                
                {/* Durian stem */}
                <rect x="30" y="24" width="4" height="8" fill="#8B4513"/>
                
                {/* Durian leaf */}
                <path d="M32 24 Q40 20 44 24 Q40 28 32 24" fill="#95D598"/>
                
                {/* Highlight */}
                <ellipse cx="28" cy="36" rx="4" ry="3" fill="#95D598" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-durian-primary">DurianRuntuh</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {!user && (
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-durian-primary bg-durian-light' 
                    : 'text-gray-700 hover:text-durian-primary hover:bg-durian-light'
                }`}
              >
                Home
              </Link>
            )}
            <Link
              to="/map"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/map') 
                  ? 'text-durian-primary bg-durian-light' 
                  : 'text-gray-700 hover:text-durian-primary hover:bg-durian-light'
              }`}
            >
              Find Durians
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-700 hover:text-durian-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-durian-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Register Stall
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 