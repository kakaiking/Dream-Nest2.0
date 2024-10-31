const router = require("express").Router()

const Booking = require("../models/Booking")
const Listing = require("../models/Listing");


// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch all bookings from the database
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, customerEmail, customerName, totalPrice, listingTitle, customerReturns, guestCount } = req.body
    const newBooking = new Booking({ customerId, hostId, listingId, customerEmail, customerName, totalPrice, listingTitle, customerReturns, guestCount })
    await newBooking.save()
    
    // Find the listing and subtract the booked shares
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const remainingShares = listing.shares - guestCount;
    // Update the listing with new remaining shares
    await Listing.findByIdAndUpdate(listingId, { shares: remainingShares });

    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})

/* EDIT BOOKING STATUS*/
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to update booking status", error: err.message });
  }
});




module.exports = router