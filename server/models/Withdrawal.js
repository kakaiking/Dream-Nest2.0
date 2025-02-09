const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
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

const Withdrawal = mongoose.model("Withdrawal", WithdrawalSchema)
module.exports = Withdrawal