import { Router } from "express";
import { createBooking, getUserBookings } from "../controllers/booking.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = Router();

// CREATE BOOKING
router.post('/', verifyToken, createBooking);

// GET USER'S BOOKINGS
router.get('/', verifyToken, getUserBookings);

export default router;