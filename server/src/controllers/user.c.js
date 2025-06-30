import UserModel from "../models/user.m.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default class UserController {
    constructor() {
        this.userModel = new UserModel();
    }

    register = async (req, res, next) => {
        try {
            const data = req.body;
            const existEmail = await this.userModel.findByEmail(data.email);
            if (existEmail) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }

            const salt = 10;
            data.password = await bcrypt.hash(data.password, salt);

            const user = await this.userModel.add(data);
            if (user) {
                return res.status(200).json({ success: true, status: 'success', message: "Register successfully!" });
            }
            return res.status(400).json({ success: false, message: "There is some errors. Please try again!" });
        } catch (error) {
            next(error);
        }
    };


    login = async (req, res, next) => {
        try {
            const data = req.body;
            const user = await this.userModel.findByEmail(data.email)
            if (!user) {
                return res.status(400).json({ message: "User does not exist" })
            }
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Wrong password!" });
            }

            const userPayload = {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            }

            const accessToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie("token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                status: 'success',
                message: 'Login successful!',
            });
        } catch (error) {
            next(error)
        }
    }

    getUser = async (req, res, next) => {
        try {
            const user = req.user;
            if (user) {
                return res.status(200).json({ success: true, user: user })
            }

            return res.status(400).json({ message: 'There is some error. Please try again!' })
        } catch (error) {
            next(error)
        }
    }

    updateUser = async (req, res, next) => {
        try {
            const user = req.user;
            let data = req.body;

            if (data.password) {
                const sat = 10;
                const passwordHash = bcrypt.hashSync(data.password, sat);
                data.password = passwordHash;
            }

            const result = await this.userModel.update(user, data);
            if (result) return res.status(200).json({ success: true, message: "Update succesfull!", user: result });
            return res.status(400).json({ message: "There is some error. Please try again!" });
        } catch (error) {
            next(error)
        }
    }

    getInterests = async (req, res, next) => {
        try {
            const user = req.user;
            const result = await this.userModel.getInterests(user);
            const data = result.map(user => ({ id: user._id, content: user.content }));
            return res.status(200).json({ success: true, data: data })
        } catch (error) {
            next(error)
        }
    }

    addInterest = async (req, res, next) => {
        try {
            const data = req.body.content;
            const user = req.user;
            const result = await this.userModel.addInterest(user, data)
            if (result) {
                return res.status(200).json({ success: true, data: result, message: 'Add interest successfull!' })
            }
            return res.status(400).json({ message: 'There is some error!' })
        } catch (error) {
            next(error)
        }
    }

    deleteInterst = async (req, res, next) => {
        try {
            const user = req.user;
            const id = req.params.id;
            const result = await this.userModel.deleteInterest(user, id)
            if (result) return res.status(200).json({ success: true, message: 'Delete successfull!' })
            return res.status(400).json({ mesage: 'There is some error!' })
        } catch (error) {
            next(error)
        }
    }
}