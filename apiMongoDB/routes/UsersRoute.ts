import { userLogin, userRegistration } from "../controllers/UsersController";
import express from "express";

const router = express.Router();

// In ra log để kiểm tra route được đăng ký
console.log("Đăng ký routes: /registerUser, /loginUser");

router.post("/registerUser", (req, res) => {
    console.log("Đã nhận yêu cầu đăng ký:", req.body);
    userRegistration(req, res);
});

router.post("/loginUser", (req, res) => {
    console.log("Đã nhận yêu cầu đăng nhập:", req.body);
    userLogin(req, res);
});

export { router as UserRoute };