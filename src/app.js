import express from "express";
import cors from "cors";
import stripeRoute from "./routes/stripe";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/api/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use("/api/webhook", stripeRoute);

app.use(express.static("public"));

export default app;
