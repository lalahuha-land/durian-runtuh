import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const initialVariety = { name: '', price: '', stock: 'high' }
const initialForm = {
  name: '',
  address: '',
  state: '',
  latitude: '',
  longitude: '',
  phone: '',
  varieties: [initialVariety]
}

const AdminPanel = () => {
  const [stalls, setStalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState(initialForm)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin-login')
      return
    }
    fetchStalls(token)
  }, [])

  const fetchStalls = async (token) => {
    setLoading(true)
    try {
      const res = await axios.get('/.netlify/functions/getAllStalls', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      setStalls(res.data)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin-login')
      }
    } finally {
      setLoading(false)
    }
  }

  // Add Stall
  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('/.netlify/functions/addStall', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      setForm(initialForm)
      fetchStalls()
    } catch (err) {
      setError('Failed to add stall')
    }
  }

  // Edit Stall
  const handleEdit = (stall) => {
    setEditId(stall.id)
    setEditForm({
      name: stall.name,
      address: stall.address,
      state: stall.state,
      latitude: stall.latitude,
      longitude: stall.longitude,
      phone: stall.phone,
      varieties: stall.varieties && stall.varieties.length > 0 ? stall.varieties : [initialVariety]
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.put('/.netlify/functions/editStall', { id: editId, ...editForm }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      })
      setEditId(null)
      setEditForm(initialForm)
      fetchStalls()
    } catch (err) {
      setError('Failed to update stall')
    }
  }

  // Delete Stall
  const handleDelete = async (id) => {
    setError('')
    if (!window.confirm('Are you sure you want to delete this stall?')) return
    try {
      await axios.delete('/.netlify/functions/deleteStall', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        data: { id }
      })
      fetchStalls()
    } catch (err) {
      setError('Failed to delete stall')
    }
  }

  // Variety helpers for add/edit forms
  const handleVarietyChange = (formState, setFormState, idx, field, value) => {
    const newVarieties = [...formState.varieties]
    newVarieties[idx][field] = value
    setFormState({ ...formState, varieties: newVarieties })
  }
  const handleAddVariety = (formState, setFormState) => {
    setFormState({ ...formState, varieties: [...formState.varieties, { ...initialVariety }] })
  }
  const handleRemoveVariety = (formState, setFormState, idx) => {
    setFormState({ ...formState, varieties: formState.varieties.filter((_, i) => i !== idx) })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

      {/* Add Stall Form */}
      <form className="card mb-6 space-y-4" onSubmit={handleAdd}>
        <h2 className="text-lg font-semibold text-durian-primary">Add New Stall</h2>
        
        {/* Stall Information */}
        <div>
          <h3 className="font-semibold text-durian-primary mb-2">Stall Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Stall Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="input-field" placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
            <input className="input-field" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            <input className="input-field" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input className="input-field" placeholder="Latitude" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
            <input className="input-field" placeholder="Longitude" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
          </div>
        </div>

        {/* Durian Varieties */}
        <div>
          <h3 className="font-semibold text-durian-primary">Durian Varieties</h3>
          {form.varieties.map((variety, idx) => (
            <div key={idx} className="flex gap-2 mb-2 flex-wrap">
              <input
                className="input-field"
                placeholder="Variety Name"
                value={variety.name}
                onChange={e => handleVarietyChange(form, setForm, idx, 'name', e.target.value)}
                required
              />
              <input
                className="input-field"
                placeholder="Price"
                value={variety.price}
                onChange={e => handleVarietyChange(form, setForm, idx, 'price', e.target.value)}
                required
              />
              <select
                className="input-field"
                value={variety.stock}
                onChange={e => handleVarietyChange(form, setForm, idx, 'stock', e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="sold-out">Sold Out</option>
              </select>
              <button type="button" className="btn-secondary" onClick={() => handleRemoveVariety(form, setForm, idx)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn-primary mt-2" onClick={() => handleAddVariety(form, setForm)}>Add Variety</button>
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto">Add Stall</button>
      </form>

      {/* Stall List */}
      <ul className="space-y-4">
        {stalls.map(stall => (
          <li key={stall.id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {editId === stall.id ? (
              <form className="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-2 flex-wrap" onSubmit={handleEditSubmit}>
                {/* Stall Information */}
                <input className="input-field" placeholder="Stall Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                <input className="input-field" placeholder="State" value={editForm.state} onChange={e => setEditForm({ ...editForm, state: e.target.value })} required />
                <input className="input-field" placeholder="Address" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} required />
                <input className="input-field" placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                <input className="input-field" placeholder="Latitude" value={editForm.latitude} onChange={e => setEditForm({ ...editForm, latitude: e.target.value })} />
                <input className="input-field" placeholder="Longitude" value={editForm.longitude} onChange={e => setEditForm({ ...editForm, longitude: e.target.value })} />
                
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setEditForm(initialForm) }}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-bold text-durian-primary text-lg">{stall.name}</div>
                  <div className="text-gray-700 text-sm">{stall.state} | {stall.address}</div>
                  <div className="text-gray-700 text-sm">📞 {stall.phone}</div>
                  <div className="text-gray-700 text-sm">Lat: {stall.latitude} | Lng: {stall.longitude}</div>
                  <div className="text-gray-700 text-sm mt-2">
                    <span className="font-semibold">Varieties:</span>
                    <ul className="list-disc ml-5">
                      {stall.varieties && stall.varieties.length > 0 ? (
                        stall.varieties.map((v, i) => (
                          <li key={i}>{v.name} - RM{v.price} ({v.stock})</li>
                        ))
                      ) : (
                        <li>No varieties listed</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button className="btn-primary" onClick={() => handleEdit(stall)}>Edit</button>
                  <button className="btn-secondary" onClick={() => handleDelete(stall.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminPanel 