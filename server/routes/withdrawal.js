const router = require("express").Router()

const Booking = require("../models/Booking")
const Listing = require("../models/Listing");
const Withdrawal = require("../models/Withdrawal");


// Get all withdrawals
router.get('/', async (req, res) => {
    try {
        const withdrawls = await Withdrawal.find(); // Fetch all bookings from the database
        res.json(withdrawls);
    } catch (error) {
        console.error('Error fetching withdrawls:', error);
        res.status(500).json({ message: 'Failed to fetch withdrawls' });
    }
});

// Get all withdrawals for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const withdrawls = await Withdrawal.find({ customerId: userId }).populate('listingId');
        res.json(withdrawls);
    } catch (error) {
        console.error('Error fetching withdrawls:', error);
        res.status(500).json({ message: 'Failed to fetch withdrawls' });
    }
});

// Get all withdrawals for a specific host
router.get('/:userId/projectWithdrawals', async (req, res) => {
    const { userId } = req.params;
    try {
        const withdrawls = await Withdrawal.find({ hostId: userId }).populate('listingId');
        res.json(withdrawls);
    } catch (error) {
        console.error('Error fetching withdrawls:', error);
        res.status(500).json({ message: 'Failed to fetch withdrawls' });
    }
});

/* EDIT WITHDRAWAL STATUS*/
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("bookingId listingId"); // Ensure bookingId and listingId are populated

        if (!updatedWithdrawal) {
            return res.status(404).json({ message: "Withdrawal not found" });
        }

        // Only proceed if the status is "approved"
        if (status === "approved") {
            const { bookingId, listingId, totalPrice, guestCount } = updatedWithdrawal;

            // Update booking and listing details
            bookingId.guestCount -= guestCount;
            bookingId.totalPrice -= totalPrice;

            listingId.shares += guestCount;

            // Save the updated booking and listing
            await bookingId.save();
            await listingId.save();
        }

        res.status(200).json(updatedWithdrawal);
    } catch (err) {
        console.error("Error updating withdrawal status:", err);
        res.status(400).json({ message: "Failed to update Withdrawal status", error: err.message });
    }
});




module.exports = router