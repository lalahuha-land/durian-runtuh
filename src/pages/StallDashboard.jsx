import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const StallDashboard = () => {
  const { user } = useAuth()
  const [stall, setStall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [updatingStall, setUpdatingStall] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showStallForm, setShowStallForm] = useState(false)

  const [stallForm, setStallForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: ''
  })

  const [stockForm, setStockForm] = useState({
    varieties: [
      { name: 'Musang King', price: '', stock: 'high' },
      { name: 'Black Thorn', price: '', stock: 'high' },
      { name: 'D24 Sultan', price: '', stock: 'high' },
      { name: 'Red Prawn', price: '', stock: 'high' },
      { name: 'D101', price: '', stock: 'high' },
      { name: 'XO', price: '', stock: 'high' },
      { name: 'Golden Phoenix', price: '', stock: 'high' }
    ]
  })

  useEffect(() => {
    fetchStallData()
  }, [])

  const fetchStallData = async () => {
    try {
      const response = await axios.get('/.netlify/functions/getStalls')
      setStall(response.data)
      
      // Set stall form data
      setStallForm({
        name: response.data.name || '',
        address: response.data.address || '',
        latitude: response.data.latitude || '',
        longitude: response.data.longitude || '',
        phone: response.data.phone || ''
      })
      
      // Load existing stock data if available
      if (response.data.latestUpdate) {
        const existingVarieties = response.data.latestUpdate.varieties
        setStockForm({
          varieties: stockForm.varieties.map(variety => {
            const existing = existingVarieties.find(v => v.name === variety.name)
            return existing ? { ...variety, price: existing.price, stock: existing.stock } : variety
          })
        })
      }
    } catch (error) {
      console.error('Error fetching stall data:', error)
      // For demo purposes, create sample stall data
      setStall({
        id: 1,
        name: 'Durian King Stall',
        address: 'Jalan Sultan, Kuala Lumpur',
        phone: '+60 12-345 6789',
        latestUpdate: null
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStallFormChange = (e) => {
    setStallForm({
      ...stallForm,
      [e.target.name]: e.target.value
    })
  }

  const handleStallSubmit = async (e) => {
    e.preventDefault()
    setUpdatingStall(true)
    setError('')
    setSuccess('')

    try {
      await axios.put('/.netlify/functions/updateStall', {
        name: stallForm.name,
        address: stallForm.address,
        latitude: parseFloat(stallForm.latitude) || null,
        longitude: parseFloat(stallForm.longitude) || null,
        phone: stallForm.phone
      })
      
      setSuccess('Stall information updated successfully!')
      setShowStallForm(false)
      fetchStallData()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update stall information')
    } finally {
      setUpdatingStall(false)
    }
  }

  const handleVarietyChange = (index, field, value) => {
    const newVarieties = [...stockForm.varieties]
    newVarieties[index] = { ...newVarieties[index], [field]: value }
    setStockForm({ ...stockForm, varieties: newVarieties })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        varieties: stockForm.varieties.filter(v => v.stock !== 'sold-out' || v.price)
      }

      await axios.post('/.netlify/functions/updateStock', updateData)
      setSuccess('Stock updated successfully!')
      
      // Refresh stall data
      fetchStallData()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update stock')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-durian-primary mx-auto mb-4"></div>
          <p className="text-durian-primary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-durian-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tips Section - now at the top and visually attractive */}
        <div className="mb-8">
          <div className="rounded-xl bg-gradient-to-r from-durian-light to-durian-cream border border-durian-primary shadow flex items-start p-6">
            <div className="flex-shrink-0 mr-4">
              <svg className="h-10 w-10 text-durian-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="#F5F6E4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-durian-primary mb-2">💡 Tips for Better Results</h3>
              <ul className="text-durian-primary text-base space-y-1 list-disc list-inside">
                <li>Update your stock daily to keep customers informed</li>
                <li>Set accurate prices to avoid customer confusion</li>
                <li>Mark varieties as <span className="font-semibold">"Sold Out"</span> when you run out</li>
                <li>Use <span className="font-semibold">"Low Stock"</span> when you have limited quantities</li>
                <li>Add your coordinates to help customers find your stall</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-durian-primary mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Update your daily stock and prices
          </p>
        </div>

        {/* Stall Info */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-durian-primary">
              {stall?.name}
            </h2>
            <button
              onClick={() => setShowStallForm(!showStallForm)}
              className="btn-secondary text-sm"
            >
              {showStallForm ? 'Cancel' : 'Edit Stall Info'}
            </button>
          </div>
          
          {!showStallForm ? (
            <div>
              <p className="text-gray-600">{stall?.address}</p>
              <p className="text-gray-600">{stall?.phone}</p>
              {stall?.latitude && stall?.longitude && (
                <p className="text-gray-600">
                  Location: {stall.latitude}, {stall.longitude}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleStallSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stall Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={stallForm.name}
                    onChange={handleStallFormChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={stallForm.phone}
                    onChange={handleStallFormChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={stallForm.address}
                  onChange={handleStallFormChange}
                  className="input-field"
                  rows="2"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={stallForm.latitude}
                    onChange={handleStallFormChange}
                    className="input-field"
                    placeholder="e.g., 3.1390"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={stallForm.longitude}
                    onChange={handleStallFormChange}
                    className="input-field"
                    placeholder="e.g., 101.6869"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                <strong>Note:</strong> Adding coordinates will help customers find your stall on the map. You can get coordinates from Google Maps by right-clicking on your location.
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={updatingStall}
                  className="btn-primary"
                >
                  {updatingStall ? 'Updating...' : 'Update Stall Info'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStallForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stock Update Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-durian-primary">
              Update Daily Stock
            </h2>
            {stall?.latestUpdate && (
              <div className="text-sm text-gray-500">
                Last updated: {new Date(stall.latestUpdate.lastUpdated).toLocaleString()}
              </div>
            )}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {stockForm.varieties.map((variety, index) => (
                <div key={variety.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{variety.name}</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`active-${index}`}
                        checked={variety.stock !== 'sold-out'}
                        onChange={(e) => handleVarietyChange(index, 'stock', e.target.checked ? 'high' : 'sold-out')}
                        className="rounded border-gray-300 text-durian-primary focus:ring-durian-primary"
                      />
                      <label htmlFor={`active-${index}`} className="text-sm text-gray-600">
                        Available
                      </label>
                    </div>
                  </div>

                  {variety.stock !== 'sold-out' ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per kg (RM)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.50"
                          value={variety.price}
                          onChange={(e) => handleVarietyChange(index, 'price', e.target.value)}
                          className="input-field"
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Level
                        </label>
                        <select
                          value={variety.stock}
                          onChange={(e) => handleVarietyChange(index, 'stock', e.target.value)}
                          className="input-field"
                        >
                          <option value="high">High Stock</option>
                          <option value="medium">Medium Stock</option>
                          <option value="low">Low Stock</option>
                          <option value="sold-out">Sold Out</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <strong>Sold Out</strong> - This variety is currently not available
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={updating}
                className="btn-primary w-full py-3 text-lg"
              >
                {updating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating stock...
                  </div>
                ) : (
                  'Update Stock'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StallDashboard 