import app from "./app.js";
import dotenv from "dotenv";

dotenv.config('.env');

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});