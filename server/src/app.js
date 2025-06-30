import express from "express";
import cors from "cors";
import NewsRouter from "./routes/news.r.js";
import SummaryRouter from "./routes/summary.r.js";
import WeatherRouter from "./routes/weather.r.js";
import UserRouter from "./routes/user.r.js";
import fileUpload from "express-fileupload";
import '../src/db/config.js'
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "https://webnews-q5xw.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(cookieParser());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/news', new NewsRouter().getRouter());
app.use('/api/summary', new SummaryRouter().getRouter());
app.use('/api/weather', new WeatherRouter().getRouter());
app.use('/api/user', new UserRouter().getRouter());


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
