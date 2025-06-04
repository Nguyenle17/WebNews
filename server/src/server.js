import app from "./app.js";
import dotenv from "dotenv";

dotenv.config('.env');

const port = process.env.PORT || 8081;
const hostname = process.env.HOSTNAME || "127.0.0.1";

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});