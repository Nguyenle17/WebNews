import express from 'express';
import SummaryController from "../controllers/summary.c.js";

export default class SummaryRouter {
    constructor() {
        this.router = express.Router();
        this.summaryController = new SummaryController();
        this.initRoute();
    }

    initRoute() {
        this.router.post('/', this.summaryController.summarize);
    }

    getRouter() {
        return this.router;
    }
}