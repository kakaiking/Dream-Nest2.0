const router = require("express").Router()

const Booking = require("../models/Booking")

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, customerEmail, customerName, totalPrice, listingTitle, customerReturns } = req.body
    const newBooking = new Booking({ customerId, hostId, listingId, customerEmail, customerName, totalPrice, listingTitle, customerReturns })
    await newBooking.save()
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