const router = require("express").Router()

const Booking = require("../models/Booking")
const Listing = require("../models/Listing");
const Withdrawal = require("../models/Withdrawal");
const TopUp = require("../models/TopUp");


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

// Check if a user has a booking for a specific listing
router.get('/has-booking/:userId/:listingId', async (req, res) => {
  const { userId, listingId } = req.params;
  try {
    const bookingExists = await Booking.exists({ customerId: userId, listingId });
    res.json({ hasBooking: bookingExists ? true : false });
  } catch (error) {
    console.error('Error checking booking:', error);
    res.status(500).json({ message: 'Failed to check booking' });
  }
});


// Get all bookings for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ customerId: userId }).populate('listingId');
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

/* WITHDRAWAL */
router.post("/:userId/withdraw", async (req, res) => {
  const { userId } = req.params;
  const { bookingId, sharesToWithdraw } = req.body;

  try {
      const booking = await Booking.findById(bookingId).populate('listingId');
      if (!booking) {
          return res.status(404).json({ error: "Booking not found" });
      }

      if (sharesToWithdraw > booking.guestCount) {
          return res.status(400).json({ error: "Insufficient shares in booking" });
      }

      const listing = booking.listingId;
      const pricePerShare = listing.target / listing.totalShares;
      const totalPrice = pricePerShare * sharesToWithdraw;

      // Create a new Withdrawal document
      const newWithdrawal = new Withdrawal({
          customerId: booking.customerId,
          hostId: booking.hostId,
          bookingId: booking._id,
          listingId: listing._id,
          customerEmail: booking.customerEmail,
          customerName: booking.customerName,
          totalPrice,
          listingTitle: booking.listingTitle,
          customerReturns: booking.customerReturns,
          guestCount: sharesToWithdraw,
          status: 'pending'
      });
      await newWithdrawal.save();

      // // Update the booking and listing with the new guest count
      // booking.guestCount -= sharesToWithdraw;
      // booking.totalPrice -= totalPrice;
      // listing.shares += sharesToWithdraw;

      // await booking.save();
      // await listing.save();

      res.status(201).json(newWithdrawal);
  } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal", error: error.message });
  }
});

/* TOP-UP */
router.post("/:userId/topup", async (req, res) => {
  const { userId } = req.params;
  const { bookingId, sharesToAdd } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate('listingId');
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const listing = booking.listingId;
    const pricePerShare = listing.target / listing.totalShares; // Assuming the same pricing logic as in withdrawal
    const totalPrice = pricePerShare * sharesToAdd;

    // Create a new TopUp document
    const newTopUp = new TopUp({
      customerId: booking.customerId,
      hostId: booking.hostId,
      bookingId: booking._id,
      listingId: listing._id,
      customerEmail: booking.customerEmail,
      customerName: booking.customerName,
      totalPrice,
      listingTitle: booking.listingTitle,
      customerReturns: booking.customerReturns,
      guestCount: sharesToAdd,
      status: 'pending'
    });
    await newTopUp.save();


    res.status(201).json(newTopUp);
  } catch (error) {
    console.error("Error processing top-up:", error);
    res.status(500).json({ message: "Failed to process top-up", error: error.message });
  }
});



module.exports = router