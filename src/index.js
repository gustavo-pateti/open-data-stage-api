import "dotenv/config";
import app from "./app";

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.DEV_PORT;

app.listen(PORT, () => console.log(`Example listening on port ${PORT}!`));
