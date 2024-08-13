const STRIPE_SECRET_KEY =
  "sk_test_51JU9uXDMhW4OFyl4FleeTJi0m2wmlRsVyCayCdgoCBRO08e0iNO4qwjMHKGr9MeVXIMgpAi8r00q4636yQ7i87gB00KUpMdNej";
/**
 * @type {import('stripe').Stripe}
 */
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const express = require("express");
const Ebook = require("../../models/ebook");
const BadRequestError = require("../../common/errors/bad-request-error");
const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

const route = express.Router();

route.post("/purchase/:ebookId", async (req, res, next) => {
  const { stripeToken } = req.body;

  try {
    const ebook = await Ebook.findById(req.params.ebookId);

    if (!ebook) throw new BadRequestError("Document Not found!");

    const charge = await stripe.charges.create({
      amount: ebook.price * 100,
      currency: "usd",
      description: "One-Time payment",
      source: stripeToken,
    });

    if (charge.status === "failed") {
      throw new BadRequestError("Payment has failed!");
    }

    const token = jwt.sign(
      { ebookId: ebook._id, userId: req.currentUser.userId },
      "secret_key",
      { expiresIn: "1d" }
    );

    const url = `http://localhost:3000/ebook/download/${token}`;

    const msg = {
      to: req.currentUser.email,
      from: "aymengani554@gmail.com",
      subject: "Thank you from your purchase!",
      html: `
                <p>Thank you for purchasing ${ebook.title}. 
                    You can download the ebook from the following URL:
                </p>
                <p><a href="${url}">${url}</a></p>
                <p>Enjoy you reading!</p>
            `,
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "Download link has been sent to your email address",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = route;
