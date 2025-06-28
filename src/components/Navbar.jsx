import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="16" cy="20" rx="10" ry="8" fill="#007852"/>
                  <path d="M6 20 L8 17.5 L10 20 L12 17.5 L14 20 L16 17.5 L18 20 L20 17.5 L22 20 L24 17.5 L26 20" stroke="#01AF5E" strokeWidth="1" fill="none"/>
                  <path d="M6 18 L8 15.5 L10 18 L12 15.5 L14 18 L16 15.5 L18 18 L20 15.5 L22 18 L24 15.5 L26 18" stroke="#01AF5E" strokeWidth="1" fill="none"/>
                  <path d="M6 22 L8 19.5 L10 22 L12 19.5 L14 22 L16 19.5 L18 22 L20 19.5 L22 22 L24 19.5 L26 22" stroke="#01AF5E" strokeWidth="1" fill="none"/>
                  <rect x="15" y="12" width="2" height="4" fill="#8B4513"/>
                  <path d="M16 12 Q20 10 22 12 Q20 14 16 12" fill="#95D598"/>
                  <ellipse cx="14" cy="18" rx="2" ry="1.5" fill="#95D598" opacity="0.3"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-durian-primary">DurianRuntuh</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-durian-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/map"
              className="text-gray-700 hover:text-durian-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Find Durians
            </Link>
            <Link
              to="/admin-login"
              className="text-gray-700 hover:text-durian-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-durian-primary focus:outline-none focus:text-durian-primary"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-durian-primary"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/map"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-durian-primary"
              onClick={() => setMenuOpen(false)}
            >
              Find Durians
            </Link>
            <Link
              to="/admin-login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-durian-primary"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 