import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'

// Custom SVG marker icon
const createCustomIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background: #007852; 
        border: 3px solid #01AF5E; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        position: relative;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 16px;
        ">🌰</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

const customIcon = createCustomIcon()

const Map = () => {
  const [stalls, setStalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('all')
  const [selectedVariety, setSelectedVariety] = useState('all')
  const [userLocation, setUserLocation] = useState([3.1390, 101.6869]) // Default to KL

  const states = [
    'all',
    'Selangor',
    'Penang',
    'Johor',
    'Perak',
    'Pahang',
    // ...add all states you support
  ]

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
      console.log('Fetched stalls:', response.data) // Debug log
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
          state: 'Selangor',
          phone: '+60 12-345 6789',
          latestUpdate: {
            varieties: [
              { name: 'Musang King', stock: 'high' },
              { name: 'Black Thorn', stock: 'medium' },
              { name: 'D24 Sultan', stock: 'low' }
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
          state: 'Selangor',
          phone: '+60 12-345 6790',
          latestUpdate: {
            varieties: [
              { name: 'Red Prawn', stock: 'high' },
              { name: 'D101', stock: 'medium' }
            ],
            lastUpdated: new Date().toISOString()
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredStalls = stalls.filter(stall => {
    const matchesState = selectedState === 'all' || stall.state === selectedState;
    const matchesVariety =
      selectedVariety === 'all' ||
      stall.latestUpdate?.varieties?.some(
        v => v.name === selectedVariety && v.stock !== 'sold-out'
      );
    
    // Debug logging
    if (selectedState !== 'all' && !matchesState) {
      console.log(`Stall ${stall.name} filtered out by state: ${stall.state} !== ${selectedState}`)
    }
    if (selectedVariety !== 'all' && !matchesVariety) {
      console.log(`Stall ${stall.name} filtered out by variety: ${selectedVariety}`)
    }
    
    return matchesState && matchesVariety;
  });

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
          {/* Search Fields */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <label className="text-gray-700 font-medium">Filter by state:</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="input-field max-w-xs"
            >
              {states.map(state => (
                <option key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </option>
              ))}
            </select>

            <label className="text-gray-700 font-medium">Filter by variety:</label>
            <select
              value={selectedVariety}
              onChange={e => setSelectedVariety(e.target.value)}
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
            
            {filteredStalls.map((stall) => {
              // Skip stalls without valid coordinates
              if (!stall.latitude || !stall.longitude) {
                console.warn(`Stall ${stall.name} missing coordinates:`, stall)
                return null
              }
              
              return (
                <Marker
                  key={stall.id}
                  position={[stall.latitude, stall.longitude]}
                  icon={customIcon}
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

                      {stall.latitude && stall.longitude && (
                        <div className="flex flex-col gap-2 mt-4">
                          <a
                            href={`https://waze.com/ul?ll=${stall.latitude},${stall.longitude}&navigate=yes`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex items-center justify-center gap-2 text-base py-2 px-4 w-full text-green-200 hover:text-white"
                            aria-label="Open in Waze"
                          >
                            <span role="img" aria-label="Waze">🚗</span> <span className="font-bold">Open in Waze</span>
                          </a>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${stall.latitude},${stall.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary flex items-center justify-center gap-2 text-base py-2 px-4 w-full text-blue-700 hover:text-durian-primary"
                            aria-label="Open in Google Maps"
                          >
                            <span role="img" aria-label="Google Maps">🗺️</span> <span className="font-bold">Open in Google Maps</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
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