import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Map from './pages/Map'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'

function AppRoutes() {
  return (
    <div className="min-h-screen bg-durian-cream">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return <AppRoutes />
}

export default App 