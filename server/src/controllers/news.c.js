
import dotenv from 'dotenv';
dotenv.config();

export default class NewsController {
    constructor() {
    }

    getNews = async (req, res, next) => {
        try {
            const data = req.body
            console.log(data)
            const response = await fetch(process.env.NEWS_URL, {
                method: "POST",
                headers: {
                    "X-API-KEY": process.env.X_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                return res.status(response.status).json({ error: errorText });
            }

            const news = await response.json();
            return res.json({ news: news.news });
        } catch (error) {
            next(error)
        }
    }
}