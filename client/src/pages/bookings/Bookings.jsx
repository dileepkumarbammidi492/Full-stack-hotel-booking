import { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './bookings.css';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setError('Please login to view your bookings.');
        setLoading(false);
        return;
      }

      if (!user.token) {
        setError('Authentication token missing. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/bookings', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="bookingsContainer">
          <p>Please login to view your bookings.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="bookingsContainer">
          <p>Loading your bookings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="bookingsContainer">
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bookingsContainer">
        <h1>My Bookings</h1>
        {user && (
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Logged in as: {user.username} (ID: {user._id})
          </p>
        )}
        {bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <div className="bookingsList">
            {bookings.map(booking => (
              <div key={booking._id} className="bookingCard">
                <h2>{booking.hotel.name}</h2>
                <p>{booking.hotel.address}</p>
                <p>Check-in: {new Date(booking.startDate).toLocaleDateString()}</p>
                <p>Check-out: {new Date(booking.endDate).toLocaleDateString()}</p>
                <p>Total Price: ${booking.totalPrice}</p>
                <p>Status: {booking.status}</p>
                <div className="rooms">
                  {booking.rooms.map(room => (
                    <div key={room.roomId._id} className="room">
                      <p>Room: {room.roomId.title}</p>
                      <p>Room Numbers: {room.roomNumbers.length}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;