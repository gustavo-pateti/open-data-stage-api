import { Router } from "express";
import stripe from "stripe";
import { auth, db } from "../admin";

const stripeAPI = stripe(process.env.STRIPE_SECRET_API_KEY);

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const router = Router();

router.post("/", (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeAPI.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      stripeAPI.customers.retrieve(session.customer, (err, customer) => {
        if (err) {
          console.log("error creating user");
          throw "Error creating app user";
        } else {
          auth
            .createUser({
              email: customer.email,
              password: "test123",
            })
            .then((user) => {
              const batch = db.batch();

              // create company doc
              const companyRef = db.collection("companies").doc(user.uid);
              batch.set(companyRef, { id: user.uid, name: customer.email });

              // create user profile doc
              const userRef = db.collection("users").doc(user.uid);
              batch.set(userRef, {
                id: user.uid,
                email: customer.email,
                password: "test123",
                company: user.uid,
                username: customer.email + "-Root",
                database: user.uid,
                role: "root",
                permissions: {
                  connections: {
                    readOnly: {},
                    none: {},
                  },
                  nodes: {
                    readOnly: {},
                    none: {},
                  },
                },
              });

              // create company's database doc
              const databaseRef = db.collection("databases").doc(user.uid);
              batch.set(databaseRef, {
                id: user.uid,
                name: customer.email + "-DB",
              });

              batch
                .commit()
                .then(() => res.json({ received: true }))
                .catch((err) => {
                  console.log(err);
                  res.json({ received: true });
                });
            })
            .catch((err) => {
              res.json({ received: true });
            });
        }
      });
      // Fulfill the purchase...
      // handleCheckoutSession(session);

      // Return a res to acknowledge receipt of the event
      // res.json({ received: true });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
