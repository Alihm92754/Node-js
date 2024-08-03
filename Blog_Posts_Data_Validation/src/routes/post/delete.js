const express = require("express");

const Post = require("../../models/post");

const router = express.Router();

router.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    const error = new Error("post id is required");
    error.status = 400;

    return next(error);
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Document not found!");
      error.status = 404;
      return next(error);
    }

    const { deletedCount } = await Post.deleteOne({
      _id: id,
      user: req.currentUser.userId,
    }); // findOneAndDelete({ _id: id })

    if (deletedCount === 0) {
      const error = new Error("Not Authorized");
      error.status = 401;
      return next(error);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
