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

/* VERIFY USER */
router.patch("/:userId/verify", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { verified: "verified" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying user", error: error.message });
  }
});

/* REJECT USER */
router.patch("/:userId/reject", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { verified: "rejected" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User rejected successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting user", error: error.message });
  }
});

// // Update user details including profile photo
// router.put("/:userId/edit", upload.single('profileImage'), async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const updateData = req.body;

//     // Fetch the existing user first
//     const existingUser = await User.findById(userId);

//     if (!existingUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Merge the existing user data with the update data
//     const mergedData = {
//       ...existingUser.toObject(),
//       ...updateData
//     };

//     // Use findByIdAndUpdate with the merged data
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       mergedData,
//       { new: true, runValidators: true }
//     );

//     res.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Error updating user profile' });
//   }
// });


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
    const { userId, listingId } = req.params
    const user = await User.findById(userId)
    const listing = await Listing.findById(listingId).populate("creator")

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
      await user.save()
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList })
    } else {
      user.wishList.push(listing)
      await user.save()
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList })
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: err.message })
  }
})



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
