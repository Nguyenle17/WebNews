import express from "express";
import cors from "cors";
import NewsRouter from "./routes/news.r.js";
import SummaryRouter from "./routes/summary.r.js";
import WeatherRouter from "./routes/weather.r.js";

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

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());

app.use('/api/news', new NewsRouter().getRouter());
app.use('/api/summary', new SummaryRouter().getRouter());
app.use('/api/weather', new WeatherRouter().getRouter());

export default app;
