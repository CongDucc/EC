import { userLogin, userRegistration } from "../controllers/UsersController";
import express from "express";

const router = express.Router();

router.post("/registerUser", userRegistration);
router.post("/loginUser", userLogin);

export { router as UserRoute };
