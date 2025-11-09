import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState({});
  const [showLotForm, setShowLotForm] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [lotForm, setLotForm] = useState({ name: '', location: '', total_slots: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLots();
    fetchStats();
    setLoading(false);
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedLot) {
        fetchSlots(selectedLot._id);
      }
      fetchLots();
      fetchStats();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [selectedLot]);

  const fetchLots = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/parking-lot', {
        headers: { Authorization: token }
      });
      setLots(response.data.data);
    } catch (err) {
      setError('Failed to fetch parking lots');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/parking-lot/admin/statistics', {
        headers: { Authorization: token }
      });
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to fetch statistics');
    }
  };

  const fetchSlots = async (lotId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/parking-slot/lot/${lotId}`, {
        headers: { Authorization: token }
      });
      setSlots(response.data.data);
    } catch (err) {
      setError('Failed to fetch parking slots');
    }
  };

  const handleLotSelect = (lot) => {
    setSelectedLot(lot);
    fetchSlots(lot._id);
  };

  const handleCreateLot = async (e) => {
    e.preventDefault();
    try {
      if (editingLot) {
        await axios.put(`http://localhost:3001/api/parking-lot/${editingLot._id}`, lotForm, {
          headers: { Authorization: token }
        });
        alert('Lot updated successfully!');
      } else {
        await axios.post('http://localhost:3001/api/parking-lot', lotForm, {
          headers: { Authorization: token }
        });
        alert('Lot created successfully!');
      }
      setShowLotForm(false);
      setEditingLot(null);
      setLotForm({ name: '', location: '', total_slots: 0 });
      fetchLots();
    } catch (err) {
      setError('Failed to save lot');
    }
  };

  const handleEditLot = (lot) => {
    setEditingLot(lot);
    setLotForm({ name: lot.name, location: lot.location, total_slots: lot.total_slots });
    setShowLotForm(true);
  };

  const handleDeleteLot = async (lotId) => {
    if (window.confirm('Are you sure you want to delete this lot? This will also delete all associated slots.')) {
      try {
        await axios.delete(`http://localhost:3001/api/parking-lot/${lotId}`, {
          headers: { Authorization: token }
        });
        fetchLots();
        alert('Lot deleted successfully!');
      } catch (err) {
        setError('Failed to delete lot');
      }
    }
  };

  const handleUpdateSlot = async (slotId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/parking-slot/${slotId}`, { status: newStatus }, {
        headers: { Authorization: token }
      });
      fetchSlots(selectedLot._id);
      fetchLots();
      fetchStats();
    } catch (err) {
      setError('Failed to update slot');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'OCCUPIED': return 'bg-red-500';
      case 'RESERVED': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">SmartPark - Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Slot Status Distribution</h3>
              <div className="h-64">
                <Pie
                  data={{
                    labels: ['Available', 'Occupied', 'Reserved'],
                    datasets: [{
                      data: [
                        stats.overall?.available || 0,
                        stats.overall?.occupied || 0,
                        stats.overall?.reserved || 0
                      ],
                      backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Occupancy by Lot</h3>
              <div className="h-64">
                <Bar
                  data={{
                    labels: lots.map(lot => lot.name),
                    datasets: [{
                      label: 'Occupancy %',
                      data: lots.map(lot => {
                        const total = lot.total_slots;
                        const occupied = total - lot.available_slots;
                        return total > 0 ? Math.round((occupied / total) * 100) : 0;
                      }),
                      backgroundColor: '#3B82F6',
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Total Available Slots</h3>
              <p className="text-2xl text-green-600">{stats.overall?.available || 0}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Total Occupied Slots</h3>
              <p className="text-2xl text-red-600">{stats.overall?.occupied || 0}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Overall Occupancy</h3>
              <p className="text-2xl text-blue-600">{stats.overall?.occupancyPercentage || 0}%</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Parking Lots</h2>
            <button
              onClick={() => setShowLotForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Lot
            </button>
          </div>

          {showLotForm && (
            <form onSubmit={handleCreateLot} className="bg-white p-4 rounded shadow mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Lot Name"
                  value={lotForm.name}
                  onChange={(e) => setLotForm({ ...lotForm, name: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={lotForm.location}
                  onChange={(e) => setLotForm({ ...lotForm, location: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Total Slots"
                  value={lotForm.total_slots}
                  onChange={(e) => setLotForm({ ...lotForm, total_slots: parseInt(e.target.value) })}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">
                  {editingLot ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLotForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {lots.map(lot => (
              <div
                key={lot._id}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                onClick={() => handleLotSelect(lot)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{lot.name}</h3>
                    <p className="text-sm text-gray-600">{lot.location}</p>
                    <p className="text-sm">Available: {lot.available_slots}/{lot.total_slots}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLot(lot);
                      }}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLot(lot._id);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLot && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Slots in {selectedLot.name}</h2>
            <div className="grid grid-cols-5 gap-4">
              {slots.map(slot => (
                <div
                  key={slot._id}
                  className={`p-4 rounded shadow text-center ${getStatusColor(slot.status)} text-white`}
                >
                  <p className="font-semibold">{slot.slot_number}</p>
                  <p className="text-sm">{slot.status}</p>
                  <div className="mt-2 space-x-1">
                    <button
                      onClick={() => handleUpdateSlot(slot._id, 'AVAILABLE')}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleUpdateSlot(slot._id, 'OCCUPIED')}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Occupied
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
