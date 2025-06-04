import express from 'express';
import NewsController from '../controllers/news.c.js';

export default class NewsRouter {
    constructor() {
        this.router = express.Router();
        this.newsController = new NewsController();
        this.initRoute();
    }

    initRoute() {
        this.router.post('/', this.newsController.getNews)
    }

    getRouter() {
        return this.router;
    }
}