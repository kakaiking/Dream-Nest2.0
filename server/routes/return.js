const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const Listing = require('../models/Listing');
const User = require('../models/User');

// Get all returns
router.get('/', async (req, res) => {
  try {
    const returns = await Return.find()
      .populate('listing')
      .populate('host') // Optional: if you want to populate the host information
      .sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Submit a return
router.post('/submit', async (req, res) => {
  try {
    const { listingId, hostId, paymentMethod, referenceCode, paymentDate, paymentTime, amountPaid } = req.body;

    const newReturn = new Return({
      listing: listingId,
      host: hostId,
      paymentMethod,
      referenceCode,
      paymentDate,
      paymentTime,
      amountPaid,
    });

    const savedReturn = await newReturn.save();

    // Update the listing status to 'Filed'
    await Listing.findByIdAndUpdate(listingId, { status: 'filed' });

    res.status(201).json(savedReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get returns for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const returns = await Return.find({ host: userId })
      .populate('listing')
      .sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;