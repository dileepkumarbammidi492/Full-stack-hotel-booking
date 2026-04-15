import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from "dotenv";
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import roomsRoute from './routes/rooms.js'
import hotelsRoute from './routes/hotel.js'
import bookingsRoute from './routes/bookings.js'
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'
import Room from './models/Room.js';
import Hotel from './models/Hotel.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_SECRET
})


const app = express();
app.use(cookieParser())
app.use(json());
app.use(cors({
    origin: 'http://localhost:5175',
}));
app.use(helmet());


// middlewares
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/hotels', hotelsRoute)
app.use('/api/rooms', roomsRoute)
app.use('/api/bookings', bookingsRoute)

// Seed route for demo
app.post('/api/seed', async (req, res) => {
  try {
    // Create sample rooms
    const sampleRooms = [
      {
        title: "Deluxe Room",
        price: 150,
        maxpeople: 2,
        desc: "Comfortable room with city view",
        roomNumbers: [
          { number: 101, unavailableDates: [] },
          { number: 102, unavailableDates: [] },
          { number: 103, unavailableDates: [] }
        ]
      },
      {
        title: "Suite",
        price: 250,
        maxpeople: 4,
        desc: "Spacious suite with balcony",
        roomNumbers: [
          { number: 201, unavailableDates: [] },
          { number: 202, unavailableDates: [] }
        ]
      }
    ];

    const createdRooms = [];
    for (const roomData of sampleRooms) {
      const room = new Room(roomData);
      const savedRoom = await room.save();
      createdRooms.push(savedRoom._id);
    }

    // Add rooms to first hotel
    const hotels = await Hotel.find();
    if (hotels.length > 0) {
      await Hotel.findByIdAndUpdate(hotels[0]._id, {
        $push: { rooms: { $each: createdRooms } }
      });
    }

    res.status(200).json({ message: 'Sample rooms added', rooms: createdRooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// mongodb connection
const main = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO);
        console.log('Database connected!');
    } catch (err) {
        console.error('Failed to connect to database', err);
        throw err;
    }
};

// error handler
app.use((err, req, res, next)=>{
    const stat = err.status || 500 
    const msg = err.message || 'something went wrong !'
    res.status(stat).json({
        success: false,
        status : stat,
        message: msg,
        stack: err.stack
    })
})

mongoose.connection.on("disconnected", () => {
    console.log('Database disconnected');
});

app.listen(8001, async () => {
    await main();  // Ensuring database connection before starting the server
    console.log('Server listening on port 8001');
});
