const { GraphQLError } = require("graphql");
const Fact = require("../models/fact");
const User = require("../models/user");
const Vote = require("../models/vote");
const validator = require("validator");

const jwt = require("jsonwebtoken");

const generateGraphqlError = (message, extensions) => {
  throw new GraphQLError(message, null, null, null, null, null, extensions);
};

module.exports = {
  authenticate: async ({ email }, context) => {
    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: "Please enter a valid email" });
    }

    if (errors.length > 0) {
      generateGraphqlError("Invalid data", {
        errors,
        code: "INVALID_DATA",
      });
    }

    try {
      const user = new User({ email });
      await user.save();

      return {
        jwt: jwt.sign({ email: user.email, userId: user._id }, "JWT_SECRET", {
          expiresIn: "30d",
        }),
      };
    } catch (err) {
      generateGraphqlError("something went wrong", {
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  createFact: async ({ content, category }, context) => {
    const errors = [];

    if (validator.isEmpty(content.trim())) {
      errors.push({ message: "content should not be empty" });
    }

    if (errors.length > 0) {
      generateGraphqlError("Invalid data", {
        errors,
        code: "INVALID_DATA",
      });
    }

    try {
      const fact = new Fact({
        user: context.payload.userId,
        content,
        category,
      });

      await fact.save();

      return fact;
    } catch (err) {
      generateGraphqlError("something went wrong", {
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },

  vote: async ({ input }, context) => {
    if (!input.factId)
      generateGraphqlError("Invalid Document ID", { code: "INVALID_DATA" });

    try {
      const vote = new Vote({
        user: context.payload.userId,
        fact: input.factId,
        isUpvote: input.isUpvote,
      });

      await vote.save();

      let fact;

      if (input.isUpvote) {
        fact = await Fact.findOneAndUpdate(
          { _id: input.factId },
          {
            $push: { upvotes: vote },
            $inc: { upvoteCount: 1 },
          },
          { new: true }
        )
          .populate("downvotes")
          .populate("upvotes");
      } else {
        fact = await Fact.findOneAndUpdate(
          { _id: input.factId },
          {
            $push: { downvotes: vote },
            $inc: { downvoteCount: 1 },
          },
          { new: true }
        )
          .populate("downvotes")
          .populate("upvotes");
      }

      return fact;
    } catch (err) {
      generateGraphqlError("something went wrong", {
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },

  getFacts: async (args, context) => {
    try {
      const facts = await Fact.find({})
        .populate("upvotes")
        .populate("downvotes")
        .sort({
          upvoteCount: -1,
          downvoteCount: 1,
        });

      return facts;
    } catch (err) {
      generateGraphqlError("something went wrong", {
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },

  getFactsByCategory: async ({ category }, context) => {
    try {
      return await Fact.find({ category });
    } catch (err) {
      generateGraphqlError("something went wrong", {
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  deleteFact: async ({ factId }, context) => {
    try {
      const fact = await Fact.findById(factId);
      if (!fact)
        return generateGraphqlError("Document not found", {
          code: "NOT_FOUND_ERROR",
        });

      const { deletedCount } = await Fact.deleteOne({
        _id: factId,
        user: context.payload.userId,
      });

      if (deletedCount === 0) {
        return generateGraphqlError("not authorized", { code: "UNAUTHORIZED" });
      }

      const votesIds = [...fact.upvotes, ...fact.downvotes];

      await Vote.deleteMany({ _id: { $in: votesIds } });

      return true;
    } catch (err) {
      generateGraphqlError("something went wrong", {
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
