const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET USER'S DETAILS
router.get("/:userId/details", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


// Update User's verified state
router.patch('/:userId/:action', async (req, res) => {
  const { userId, action } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update user status based on action
    if (action === 'verified') {
      user.verified = 'verified';
    } else if (action === 'rejected') {
      user.verified = 'rejected';
    } else if (action === 'notVerified') {
      user.verified = 'notVerified'; // Assuming you want to set it back to pending
    } else {
      return res.status(400).send({ message: 'Invalid action' });
    }

    await user.save();
    res.send({ user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});


/* GET USER'S TRIP LIST */
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
    res.status(202).json(trips)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find trips!", error: err.message })
  }
})

/* ADD LISTING TO USER'S WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    // console.log(UserId: ${userId}, ListingId: ${listingId}); // Log IDs

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listingExists = await Listing.exists({ _id: listingId });
    if (!listingExists) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const favoriteListing = user.wishList.includes(listingId);
    // console.log(Favorite Listing Exists: ${favoriteListing}); // Log wishlist state

    if (favoriteListing) {
      user.wishList = user.wishList.filter((id) => id.toString() !== listingId);
      await user.save();
      return res.status(200).json({ message: "Listing removed", wishList: user.wishList });
    } else {
      user.wishList.push(listingId);
      await user.save();
      return res.status(200).json({ message: "Listing added", wishList: user.wishList });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





/* GET USER'S PROPERTY LIST and add it to the empty array "propertyList" in the user*/
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")

    res.status(202).json(properties)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find properties!", error: err.message })
  }
})


/* GET USER'S RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
    res.status(202).json(reservations)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find reservations!", error: err.message })
  }
})



module.exports = router