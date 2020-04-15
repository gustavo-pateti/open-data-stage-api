import * as admin from "firebase-admin";

const isProduction = process.env.NODE_ENV === "production";
const prefix = isProduction ? "PROD" : "DEV";

const serviceAccount = {
  type: process.env[`${prefix}_ADMIN_TYPE`],
  project_id: process.env[`${prefix}_ADMIN_PROJECT_ID`],
  private_key_id: process.env[`${prefix}_ADMIN_PRIVATE_KEY_ID`],
  private_key: process.env[`${prefix}_ADMIN_PRIVATE_KEY`],
  client_email: process.env[`${prefix}_ADMIN_CLIENT_EMAIL`],
  client_id: process.env[`${prefix}_ADMIN_CLIENT_ID`],
  auth_uri: process.env[`${prefix}_ADMIN_AUTH_URI`],
  token_uri: process.env[`${prefix}_ADMIN_TOKEN_URI`],
  auth_provider_x509_cert_url: process.env[`${prefix}_ADMIN_AUTH_PROVIDER_URL`],
  client_x509_cert_url: process.env[`${prefix}_ADMIN_CLIENT_URL`],
};

const databaseURL = process.env[`${prefix}_DATABASE_URL`];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
