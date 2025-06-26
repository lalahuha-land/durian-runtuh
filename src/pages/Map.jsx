import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios'

const Map = () => {
  const [stalls, setStalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVariety, setSelectedVariety] = useState('all')
  const [userLocation, setUserLocation] = useState([3.1390, 101.6869]) // Default to KL

  const durianVarieties = [
    'all',
    'Musang King',
    'Black Thorn',
    'D24 Sultan',
    'Red Prawn',
    'D101',
    'XO',
    'Golden Phoenix'
  ]

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('Location access denied, using default location')
        }
      )
    }

    fetchStalls()
  }, [])

  const fetchStalls = async () => {
    try {
      const response = await axios.get('/.netlify/functions/getStalls')
      setStalls(response.data)
    } catch (error) {
      console.error('Error fetching stalls:', error)
      // For demo purposes, add some sample data
      setStalls([
        {
          id: 1,
          name: 'Durian King Stall',
          latitude: 3.1390,
          longitude: 101.6869,
          address: 'Jalan Sultan, Kuala Lumpur',
          phone: '+60 12-345 6789',
          latestUpdate: {
            varieties: [
              { name: 'Musang King', price: 45, stock: 'high' },
              { name: 'Black Thorn', price: 35, stock: 'medium' },
              { name: 'D24 Sultan', price: 25, stock: 'low' }
            ],
            lastUpdated: new Date().toISOString()
          }
        },
        {
          id: 2,
          name: 'Fresh Durian Corner',
          latitude: 3.1450,
          longitude: 101.6900,
          address: 'Petaling Street, KL',
          phone: '+60 12-345 6790',
          latestUpdate: {
            varieties: [
              { name: 'Red Prawn', price: 30, stock: 'high' },
              { name: 'D101', price: 28, stock: 'medium' }
            ],
            lastUpdated: new Date().toISOString()
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredStalls = selectedVariety === 'all' 
    ? stalls 
    : stalls.filter(stall => 
        stall.latestUpdate?.varieties?.some(v => v.name === selectedVariety && v.stock !== 'sold-out')
      )

  const getStockColor = (stock) => {
    switch (stock) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-orange-600'
      case 'sold-out': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStockText = (stock) => {
    switch (stock) {
      case 'high': return 'High Stock'
      case 'medium': return 'Medium Stock'
      case 'low': return 'Low Stock'
      case 'sold-out': return 'Sold Out'
      default: return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-durian-primary mx-auto mb-4"></div>
          <p className="text-durian-primary">Loading durian stalls...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-durian-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-durian-primary mb-4">
            Find Durian Stalls Near You
          </h1>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-gray-700 font-medium">Filter by variety:</label>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="input-field max-w-xs"
            >
              {durianVarieties.map(variety => (
                <option key={variety} value={variety}>
                  {variety === 'all' ? 'All Varieties' : variety}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              {filteredStalls.length} stall{filteredStalls.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {filteredStalls.map((stall) => (
              <Marker
                key={stall.id}
                position={[stall.latitude, stall.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-durian-primary text-lg mb-2">
                      {stall.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{stall.address}</p>
                    <p className="text-gray-600 text-sm mb-3">📞 {stall.phone}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">Available Varieties:</h4>
                      {stall.latestUpdate?.varieties?.map((variety, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{variety.name}</span>
                          <div className="text-right">
                            <span className="font-bold text-durian-primary">
                              RM{variety.price}/kg
                            </span>
                            <br />
                            <span className={getStockColor(variety.stock)}>
                              {getStockText(variety.stock)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(stall.latestUpdate?.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Stall List (Mobile View) */}
        <div className="mt-8 md:hidden">
          <h2 className="text-xl font-bold text-durian-primary mb-4">Nearby Stalls</h2>
          <div className="space-y-4">
            {filteredStalls.map((stall) => (
              <div key={stall.id} className="card">
                <h3 className="font-bold text-durian-primary text-lg mb-2">
                  {stall.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{stall.address}</p>
                <p className="text-gray-600 text-sm mb-3">📞 {stall.phone}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Available Varieties:</h4>
                  {stall.latestUpdate?.varieties?.map((variety, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{variety.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-durian-primary">
                          RM{variety.price}/kg
                        </span>
                        <br />
                        <span className={getStockColor(variety.stock)}>
                          {getStockText(variety.stock)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(stall.latestUpdate?.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map 