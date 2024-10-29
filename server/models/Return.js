const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'bank'],
      required: true,
    },
    referenceCode: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentTime: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'Rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Return = mongoose.model("Return", ReturnSchema);

module.exports = Return;