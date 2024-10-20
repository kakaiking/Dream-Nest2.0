const mongoose = require("mongoose")

const ListingSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bidExpiry: {
      type: Date,
      required: true,
    },
    financialInstruments: {
      type: String,
      required: true,
    },
    returns: {
      type: Number,
      required: true,
    },
    paymentDates: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    totalShares: {
      type: Number,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    highlightDesc: {
      type: String,
      required: true
    },
    updates: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Update',
    }],
    status: {
      type: String,
      enum: ['notFiled', 'filed'],
      default: 'notFiled',
    },
  },
  { timestamps: true}
)

const Listing = mongoose.model("Listing", ListingSchema )
module.exports = Listing