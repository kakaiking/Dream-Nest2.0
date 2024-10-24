const express = require('express');
const router = express.Router();
const Update = require('../models/Update');
const Listing = require('../models/Listing');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all updates (new route)
router.get('/', async (req, res) => {
  try {
    const updates = await Update.find().populate('listing');
    res.status(200).json(updates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch updates", error: err.message });
  }
});

// Create a new update
router.post("/create", authMiddleware, upload.array('supportingDocuments', 5), async (req, res) => {
  try {
    const { listingId, title, description, videoLink } = req.body;
    const listing = await Listing.findById(listingId).populate("creator");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }

    if (listing.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to create updates for this listing." });
    }

    const supportingDocuments = req.files.map(file => ({
      fileName: file.originalname,
      fileUrl: file.filename,  // Store only the filename
      fileType: file.mimetype
    }));

    const newUpdate = new Update({
      listing: listingId,
      title,
      description,
      videoLink,
      supportingDocuments
    });

    const savedUpdate = await newUpdate.save();
    listing.updates.push(savedUpdate._id);
    await listing.save();

    res.status(200).json(savedUpdate);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
});

// Get updates for a specific listing
router.get("/listing/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const updates = await Update.find({ listing: listingId }).sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Failed to fetch updates", error: err.message });
  }
});

// Get a specific update
router.get("/:updateId", async (req, res) => {
  try {
    const { updateId } = req.params;
    const update = await Update.findById(updateId).populate("listing");
    res.status(200).json(update);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Update not found", error: err.message });
  }
});

module.exports = router