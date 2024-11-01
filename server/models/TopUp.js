const mongoose = require("mongoose");

const TopUpSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    listingTitle: {
      type: String,
      required: true,
    },
    customerReturns: {
      type: Number,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const TopUp = mongoose.model("TopUp", TopUpSchema)
module.exports = TopUp