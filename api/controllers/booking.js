import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { createError } from '../utils/error.js';

// CREATE BOOKING
export const createBooking = async (req, res, next) => {
    try {
        const { hotelId, rooms, startDate, endDate, totalPrice } = req.body;

        // Validate required fields
        if (!hotelId || !rooms || !startDate || !endDate || !totalPrice) {
            return next(createError(400, "All fields are required"));
        }

        // Check room availability
        for (const room of rooms) {
            const roomData = await Room.findById(room.roomId);
            if (!roomData) {
                return next(createError(404, "Room not found"));
            }

            // Check if room numbers are available
            for (const roomNumberId of room.roomNumbers) {
                const roomNumber = roomData.roomNumbers.id(roomNumberId);
                if (!roomNumber) {
                    return next(createError(404, "Room number not found"));
                }

                // Check for date conflicts
                const isAvailable = !roomNumber.unavailableDates.some(date =>
                    new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)
                );

                if (!isAvailable) {
                    return next(createError(400, "Room not available for selected dates"));
                }
            }
        }

        // Create booking
        const newBooking = new Booking({
            user: req.user.id,
            hotel: hotelId,
            rooms: rooms,
            startDate,
            endDate,
            totalPrice
        });

        const savedBooking = await newBooking.save();

        // Update room availability
        for (const room of rooms) {
            const dates = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            let current = new Date(start);

            while (current <= end) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }

            await Room.updateOne(
                { "roomNumbers._id": { $in: room.roomNumbers } },
                { $push: { "roomNumbers.$[].unavailableDates": { $each: dates } } }
            );
        }

        res.status(201).json(savedBooking);
    } catch (err) {
        next(err);
    }
};

// GET USER'S BOOKINGS
export const getUserBookings = async (req, res, next) => {
    try {
        console.log('Getting bookings for user:', req.user.id);
        const bookings = await Booking.find({ user: req.user.id })
            .populate('hotel', 'name address')
            .populate('rooms.roomId', 'title price')
            .sort({ createdAt: -1 });
        
        console.log('Found bookings:', bookings.length);
        console.log('Bookings data:', JSON.stringify(bookings, null, 2));
        res.status(200).json(bookings);
    } catch (err) {
        console.log('Error in getUserBookings:', err);
        next(err);
    }
};