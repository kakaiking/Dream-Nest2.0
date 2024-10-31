const router = require("express").Router()

const Booking = require("../models/Booking")
const Listing = require("../models/Listing");

/* Withdraw*/
router.post("/:userId/withdraw", async (req, res) => {
    // subtract withdrawed guestcount from the booking's guestcount for that booking and update new withdrawal and update booking's guestcount, also update listing's remainingShares
});

module.exports = router