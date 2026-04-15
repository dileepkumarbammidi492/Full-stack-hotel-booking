import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    rooms: [{
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        roomNumbers: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }]
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "confirmed"
    }
}, {
    timestamps: true
});

export default mongoose.model("Booking", BookingSchema);