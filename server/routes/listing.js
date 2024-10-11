const router = require("express").Router();
const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User")

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// Get all property listings
router.get('/all', async (req, res) => {
  try {
    const listings = await Listing.find(); // Fetch all listings from the database
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

/* CREATE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    /* Take the information from the form */
    const {
      creator,
      category,
      type,
      bidExpiry,
      financialInstruments,
      returns,
      paymentDates,
      target,
      title,
      description,
      highlightDesc,
    } = req.body;

    const newListing = new Listing({
      creator,
      category,
      type,
      bidExpiry,
      financialInstruments,
      returns,
      paymentDates,
      target,
      title,
      description,
      highlightDesc,
    });

    const savedListing = (await newListing.save()).populate("creator");

    const user = await User.findById(creator);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.propertyList.push(savedListing);
    await user.save();

    res.status(200).json(savedListing);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: "Failed to create listing", error: err.message });
  }
});


/* GET lISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
  const qCategory = req.query.category

  try {
    let listings
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator")
    } else {
      listings = await Listing.find().populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { category: {$regex: search, $options: "i" } },
          { title: {$regex: search, $options: "i" } },
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findById(listingId).populate("creator")
    res.status(202).json(listing)
  } catch (error) {
    res.status(404).json({ message: "Listing can not found!", error: err.message })
    console.log(error)
  }
})

module.exports = router