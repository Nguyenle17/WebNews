import express from 'express';
import UserController from '../controllers/user.c.js';
import { authenticate } from '../middlewares/auth.js';

export default class UserRouter {
    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.initRoute();
    }

    initRoute() {
        this.router.post('/auth/register', this.userController.register)
        this.router.post('/auth/login', this.userController.login)
        this.router.use('/', authenticate)
        this.router.get('/info', this.userController.getUser)
        this.router.get('/interest', this.userController.getInterests)
        this.router.put('/interest', this.userController.addInterest)
        this.router.put('/update', this.userController.updateUser)
        this.router.delete('/remove-interest/:id', this.userController.deleteInterst)
    }

    getRouter() {
        return this.router;
    }
}