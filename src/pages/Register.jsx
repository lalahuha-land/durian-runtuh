import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    stallName: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      stall: {
        name: formData.stallName,
        address: formData.address
      }
    }

    const result = await register(userData)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-durian-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
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
          <h2 className="text-3xl font-bold text-durian-primary">
            Register Your Stall
          </h2>
          <p className="mt-2 text-gray-600">
            Join DurianRuntuh and start connecting with customers
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-durian-primary mb-4">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+60 12-345 6789"
                  />
                </div>
              </div>
            </div>

            {/* Stall Information */}
            <div>
              <h3 className="text-lg font-semibold text-durian-primary mb-4">
                Stall Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="stallName" className="block text-sm font-medium text-gray-700 mb-2">
                    Stall Name *
                  </label>
                  <input
                    id="stallName"
                    name="stallName"
                    type="text"
                    required
                    value={formData.stallName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Durian King Stall"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Stall Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Full address of your stall"
                  />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h3 className="text-lg font-semibold text-durian-primary mb-4">
                Account Security
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Repeat your password"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-durian-primary hover:text-durian-secondary font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-durian-primary hover:text-durian-secondary font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register 