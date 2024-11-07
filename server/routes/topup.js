const router = require("express").Router()

const Booking = require("../models/Booking")
const Listing = require("../models/Listing");
const TopUp = require("../models/TopUp");


// Get all topups
router.get('/', async (req, res) => {
    try {
        const topups = await TopUp.find(); // Fetch all bookings from the database
        res.json(topups);
    } catch (error) {
        console.error('Error fetching topups:', error);
        res.status(500).json({ message: 'Failed to fetch topups' });
    }
});

// Get all topups for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const topups = await TopUp.find({ customerId: userId }).populate('listingId');
        res.json(topups);
    } catch (error) {
        console.error('Error fetching topups:', error);
        res.status(500).json({ message: 'Failed to fetch topups' });
    }
});

// Get all topups for a specific host
router.get('/:userId/projectTopups', async (req, res) => {
    const { userId } = req.params;
    try {
        const topups = await TopUp.find({ hostId: userId }).populate('listingId');
        res.json(topups);
    } catch (error) {
        console.error('Error fetching topups:', error);
        res.status(500).json({ message: 'Failed to fetch topups' });
    }
});

// Get all topups for a specific listing
router.get('/:listingId/projectTopups', async (req, res) => {
    const { listingId } = req.params;
    try {
        // Fetch topups by listingId and populate listingId field with specific fields
        const topups = await TopUp.find({
            listingId: mongoose.Types.ObjectId(listingId),
            status: 'approved',
        }).populate({
            path: 'listingId', // Reference to listingId in TopUp model
            select: 'listingTitle target' // Select only the relevant fields from listingId
        });
        // Respond with the fetched topups
        res.json(topups);
    } catch (error) {
        console.error('Error fetching topups:', error);
        res.status(500).json({ message: 'Failed to fetch topups' });
    }
});



/* EDIT TOPUP STATUS*/
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedTopup = await TopUp.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("bookingId listingId"); // Ensure bookingId and listingId are populated

        if (!updatedTopup) {
            return res.status(404).json({ message: "Topup not found" });
        }

        // Only proceed if the status is "approved"
        if (status === "approved") {
            const { bookingId, listingId, totalPrice, guestCount } = updatedTopup;

            // Update booking and listing details
            bookingId.guestCount += guestCount;
            bookingId.totalPrice += totalPrice;

            listingId.shares -= guestCount;

            // Save the updated booking and listing
            await bookingId.save();
            await listingId.save();
        }

        res.status(200).json(updatedTopup);
    } catch (err) {
        console.error("Error updating topup status:", err);
        res.status(400).json({ message: "Failed to update topup status", error: err.message });
    }
});




module.exports = router