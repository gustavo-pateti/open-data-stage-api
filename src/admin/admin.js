import * as admin from "firebase-admin";

const isProduction = process.env.NODE_ENV === "production";
const prefix = isProduction ? "PROD" : "DEV";

const serviceAccount = isProduction
  ? require("../../admin-key.json")
  : require("../../admin-key-dev.json");

const databaseURL = process.env[`${prefix}_DATABASE_URL`];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
