import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('/.netlify/functions/adminLogin', form)
      localStorage.setItem('adminToken', res.data.token)
      navigate('/admin')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-durian-cream">
      <form className="card max-w-md w-full space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-durian-primary text-center">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-field"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary w-full">Login</button>
      </form>
    </div>
  )
}

export default AdminLogin 