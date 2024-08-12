const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fact: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Fact",
  },
  isUpvote: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Vote", voteSchema);
