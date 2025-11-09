import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLots();
    fetchBookings();
    setLoading(false);
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedLot) {
        fetchSlots(selectedLot._id);
      }
      fetchLots();
      fetchBookings();
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

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/bookings', {
        headers: { Authorization: token }
      });
      setBookings(response.data.data);
    } catch (err) {
      setError('Failed to fetch bookings');
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

  const handleBook = async (slotId) => {
    try {
      await axios.post('http://localhost:3001/api/bookings/book', {
        slot_id: slotId
      }, {
        headers: { Authorization: token }
      });
      fetchSlots(selectedLot._id);
      fetchBookings();
      alert('Slot booked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book slot');
    }
  };

  const handleCheckin = async (bookingId) => {
    try {
      await axios.put(`http://localhost:3001/api/bookings/checkin/${bookingId}`, {}, {
        headers: { Authorization: token }
      });
      fetchSlots(selectedLot._id);
      fetchBookings();
      alert('Checked in successfully!');
    } catch (err) {
      setError('Failed to check in');
    }
  };

  const handleCheckout = async (bookingId) => {
    try {
      await axios.put(`http://localhost:3001/api/bookings/checkout/${bookingId}`, {}, {
        headers: { Authorization: token }
      });
      fetchSlots(selectedLot._id);
      fetchBookings();
      alert('Checked out successfully!');
    } catch (err) {
      setError('Failed to check out');
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
            <h1 className="text-3xl font-bold text-gray-900">SmartPark - User Dashboard</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Parking Lots</h2>
            <div className="space-y-2">
              {lots.map(lot => (
                <div
                  key={lot._id}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                  onClick={() => handleLotSelect(lot)}
                >
                  <h3 className="font-semibold">{lot.name}</h3>
                  <p className="text-sm text-gray-600">{lot.location}</p>
                  <p className="text-sm">Available: {lot.available_slots}/{lot.total_slots}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            <div className="space-y-2">
              {bookings.filter(b => b.user_id._id === user.id).map(booking => (
                <div key={booking._id} className="bg-white p-4 rounded shadow">
                  <p>Slot: {booking.slot_id?.slot_number}</p>
                  <p>Status: {booking.status}</p>
                  {booking.status === 'RESERVED' && (
                    <button
                      onClick={() => handleCheckin(booking._id)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Check-in
                    </button>
                  )}
                  {booking.status === 'OCCUPIED' && (
                    <button
                      onClick={() => handleCheckout(booking._id)}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Check-out
                    </button>
                  )}
                </div>
              ))}
            </div>
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
                  {slot.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleBook(slot._id)}
                      className="mt-2 bg-white text-black px-2 py-1 rounded text-xs hover:bg-gray-200"
                    >
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
