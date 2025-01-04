const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Update = require('../models/Update');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'firmName profileImagePath') // Populate user with specific fields
      .populate({
        path: 'update',
        select: 'title listing',
        populate: {
          path: 'listing',
          select: 'title', // Populate listing with only the title field
        },
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'firmName profileImagePath', // Populate user fields in replies
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});


// Create a new comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { updateId, content, parentCommentId } = req.body;
    const newComment = new Comment({
      user: req.user._id,
      update: updateId,
      content,
      parentComment: parentCommentId || null
    });

    const savedComment = await newComment.save();

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: savedComment._id }
      });
    } else {
      await Update.findByIdAndUpdate(updateId, {
        $push: { comments: savedComment._id }
      });
    }

    const populatedComment = await Comment.findById(savedComment._id)
      .populate('user', 'firmName profileImagePath')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'firmName profileImagePath' }
      });

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating comment', error: err.message });
  }
});

// Get comments for an update
router.get('/update/:updateId', async (req, res) => {
  try {
    const { updateId } = req.params;
    const comments = await Comment.find({ update: updateId, parentComment: null })
      .populate('user', 'firmName profileImagePath')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'firmName profileImagePath' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching comments', error: err.message });
  }
});

module.exports = router;