const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categories = [
  "HISTORY",
  "SCIENCE",
  "ART",
  "SPORTS",
  "TECHNOLOGY",
  "OTHER",
];

const factSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: categories,
    required: true,
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vote",
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vote",
    },
  ],
  upvoteCount: {
    type: Number,
    default: 0,
  },
  downvoteCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Fact", factSchema);
