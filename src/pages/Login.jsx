import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
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

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-durian-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
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
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to manage your stall
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Your password"
              />
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
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-durian-primary hover:text-durian-secondary font-medium"
              >
                Register your stall
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

export default Login 