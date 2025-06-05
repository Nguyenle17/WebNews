
import OpenAI from 'openai'
import dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";
dotenv.config();

export default class NewsController {
    constructor() {
        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.API_KEY,
        })
    }

    getNews = async (req, res, next) => {
        try {
            const data = req.body
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

    summaryNews = async (req, res, next) => {
        try {
            const { data, models } = req.body;
            let response = await fetch(process.env.NEWS_URL, {
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
            const newsLink = news.news.map(item => item.link)
            if (models.models === 'deepseek-r1-0528') {
                const completion = await this.openai.chat.completions.create({
                    model: 'deepseek/deepseek-r1-0528:free',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,
                        },
                    ],
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }


            if (models.models === 'gpt-4o') {
                const completion = await this.openai.chat.completions.create({
                    model: 'openai/gpt-4o-2024-11-20',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,
                        },
                    ],
                    max_tokens: 4000,
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }

            if (models.models === '"meta-llama-3.3-8b') {
                const completion = await this.openai.chat.completions.create({
                    model: '"meta-llama/llama-3.3-8b-instruct:free',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,
                        },
                    ],
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }

            if (models.models === 'gemma-3n-e4b-it') {
                const completion = await this.openai.chat.completions.create({
                    model: 'google/gemma-3n-e4b-it:free',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,
                        },
                    ],
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }

            if (models.models === 'llama-3.1-8b-instruct') {
                const completion = await this.openai.chat.completions.create({
                    model: 'meta-llama/llama-3.1-8b-instruct:free',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,

                        },
                    ],
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }

            if (models.models === 'llama-4-maverick') {
                const completion = await this.openai.chat.completions.create({
                    model: 'meta-llama/llama-4-maverick:free',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,
                        },
                    ],
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }

            if (models.models === 'gpt-4.1') {
                const completion = await this.openai.chat.completions.create({
                    model: 'openai/gpt-4.1',
                    messages: [
                        {
                            role: 'user',
                            content: `Đọc các tin tức từ đường link sau: ${newsLink}. Hãy tóm tắt nội dung chính của tất cả các tin tức từ các bài báo một cách ngắn gọn, không hiển thị đường link bài viết`,
                        },
                    ],
                    max_tokens: 3000,
                });
                return res.json({ message: completion.choices[0].message, news: news.news });
            }

        } catch (error) {
            next(error)
        }
    }
}