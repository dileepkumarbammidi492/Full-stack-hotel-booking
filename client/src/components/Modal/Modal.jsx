import { useContext, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import './modal.css'
import { IoClose } from "react-icons/io5";
import { SearchContext } from '../../context/searchContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'

const Modal = ({setModalOpen, id}) => {
  const {data, loading, error} = useFetch(`/api/hotels/room/${id}`)
  const [selectRoom, setSelectRoom] = useState('')
  const [selectedRooms, setSelectedRooms] = useState([])
  const {date, options} = useContext(SearchContext)
  const {user} = useContext(AuthContext)
  const navigate = useNavigate()
  // console.log(data);
  const selectedRoom = data.find(room => room.title == selectRoom)
  console.log(selectedRoom);
  const handleChange = (e) =>{
    setSelectRoom(e.target.value)
  }

  const handleCheck = (e) =>{
    const checked = e.target.checked
    const value = e.target.value
    setSelectedRooms(
      checked ? [...selectedRooms, value] : selectedRooms.filter(item => item !== value)
    )
  }

  const dateInRange = (startDate, endDate) => {
    const start = new Date(startDate);  // Starting date
    const end = new Date(endDate);      // Ending date
  
    let dateNow = new Date(start);  // Initialize dateNow as a Date object
    const datesList = [];
  
    // While dateNow is before the end date
    while (dateNow <= end) {
      datesList.push(new Date(dateNow).getTime());  // Add current date to list
      dateNow.setDate(dateNow.getDate() + 1);  // Increment by one day
    }
  
    return datesList;  // Return the list of dates
  }
  
  const allDatesRange = (dateInRange(date[0].startDate, date[0].endDate))

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some(date => allDatesRange.includes(new Date(date).getTime()))
    return !isFound;
  }

  const getAvailableCount = (room) => {
    return room.roomNumbers.filter(number => isAvailable(number)).length;
  }

  const handleSubmit =async (e) =>{
    e.preventDefault();
    if (!user) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }
    if (!selectRoom) {
      toast.error('Please select a room type');
      return;
    }
    if (selectedRooms.length === 0) {
      toast.error('Please select at least one room');
      return;
    }
    if (!date || !date[0] || !date[0].startDate || !date[0].endDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const startDate = new Date(date[0].startDate);
      const endDate = new Date(date[0].endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      if (days <= 0) {
        toast.error('Check-out date must be after check-in date');
        return;
      }

      const bookingData = {
        hotelId: id,
        rooms: [{
          roomId: selectedRoom._id,
          roomNumbers: selectedRooms
        }],
        startDate: date[0].startDate,
        endDate: date[0].endDate,
        totalPrice: selectedRoom.price * selectedRooms.length * days
      };

      await axios.post('/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      toast.success('Reservation successful!');
      setModalOpen(false);
      navigate('/');
    } catch (err) {
      console.log(err);
      toast.error(`Reservation failed: ${err.response?.data?.message || err.message}`);
    }
  }

  return (
    <>
      {loading ? "loading" : 
        <div className='Modal'>
        <div className="ModalContainer">
        <div className="closer">
        <IoClose 
            onClick={()=>setModalOpen(false)}
        />
        </div>
            <p className='Rtext'>Reserve Hotel !</p>
          {data.length === 0 ? (
            <p style={{color: 'red', textAlign: 'center'}}>No rooms available for this hotel.</p>
          ) : (
            <>
              <div className="roomSelect">
              <span>select room :</span>
              <select name="select" id="selecter"  onChange={handleChange}  className='select'>
                <option value="">--select room--</option>
                {
                  data.map(room=>(
                    <option key={room._id} value={room.title}>
                      {room.title} - {getAvailableCount(room)} available
                    </option>
                  ))
                }
              </select>
              </div>
              {
                selectRoom && 
                <>
                  <div className="roomContents">
                    <div className="roomTitle">Room Type: {selectedRoom.title}</div>
                    <div className="roomPrice">Price: ${selectedRoom.price} per night</div>
                    <div className="maxPeople">Max People: {selectedRoom.maxpeople}</div>
                    <div className="description">Description: {selectedRoom.desc}</div>
                    <div className="availableCount">Available Rooms: {getAvailableCount(selectedRoom)}</div>
                    <div className="roomNumber">
                      <span>Select Room Numbers:</span>
                      {
                        selectedRoom.roomNumbers.map(number =>(
                          <div 
                          className="roomSelectorContainer">
                            <div className='roomSelector'>
                            <span>Room {number.number} {isAvailable(number) ? '(Available)' : '(Booked)'}</span>
                            <input type="checkbox" disabled={!isAvailable(number)} key={number._id} value={number._id} onChange={handleCheck}/>
                          </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>   
                </>
              }
              <div className="btnDiv">
              <button className='ModalBtn' onClick={handleSubmit}>Reserve Now !</button>
              </div>
            </>
          )}
        </div>
    </div>
      }
    </>
  )
}

export default Modal