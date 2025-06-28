import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-durian-primary to-durian-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Fresh Durians
              <span className="block text-durian-yellow">Near You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-durian-light">
              The ultimate app for durian lovers. Check stock and prices at local stalls in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/map"
                className="bg-durian-yellow text-durian-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-colors"
              >
                Find Durians Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-durian-primary mb-4">
              Why DurianRuntuh?
            </h2>
            <p className="text-xl text-gray-600">
              Never waste another trip to find your favorite durian
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-durian-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-durian-primary mb-2">
                Real-Time Location
              </h3>
              <p className="text-gray-600">
                Find durian stalls near you with our interactive map. See exactly where to go for the best durians.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-durian-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-durian-primary mb-2">
                Live Price Updates
              </h3>
              <p className="text-gray-600">
                Get current prices for all durian varieties. No more surprises when you arrive at the stall.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-durian-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-durian-primary mb-2">
                Instant Stock Check
              </h3>
              <p className="text-gray-600">
                Check if your favorite durian variety is in stock before making the trip. Save time and disappointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Varieties Section */}
      <section className="py-20 bg-durian-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-durian-primary mb-4">
              Popular Durian Varieties
            </h2>
            <p className="text-xl text-gray-600">
              Find the durian variety you love
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Musang King', emoji: '👑', description: 'The king of durians' },
              { name: 'Black Thorn', emoji: '🖤', description: 'Sweet and creamy' },
              { name: 'D24 Sultan', emoji: '⚜️', description: 'Classic favorite' },
              { name: 'Red Prawn', emoji: '🦐', description: 'Unique flavor profile' }
            ].map((variety) => (
              <div key={variety.name} className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-2">{variety.emoji}</div>
                <h3 className="text-lg font-bold text-durian-primary mb-1">
                  {variety.name}
                </h3>
                <p className="text-gray-600 text-sm">{variety.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-durian-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Durian?
          </h2>
          <p className="text-xl mb-8 text-durian-light">
            Join thousands of durian lovers who never waste a trip
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/map"
              className="bg-durian-yellow text-durian-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-colors"
            >
              Start Exploring Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 