import express from 'express'
import WeatherController from "../controllers/weather.c.js";

export default class WeatherRouter {
    constructor() {
        this.router = express.Router();
        this.weatherController = new WeatherController();
        this.initRoute();
    }

    initRoute() {
        this.router.post('/', this.weatherController.getInfoWeather)
        this.router.post('/forecast', this.weatherController.getInfoWeatherFuture)
        this.router.post('/analysis', this.weatherController.analysisWeather)
    }

    getRouter() {
        return this.router;
    }
}