import express from "express"
import cors from 'cors'
import NewsRouter from "./routes/news.r.js";


const app = express()

app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/api/news', new NewsRouter().getRouter())

export default app