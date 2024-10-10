const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
    },
    supportingDocuments: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  { timestamps: true }
);

const Update = mongoose.model("Update", UpdateSchema);
module.exports = Update;