import { Request, Response } from "express";
import { UserAddressParams, userLoginParams, userModelParams, } from "../dto/User";
import { USERLOG } from "../models/UserModel";

export const userRegistration = async (
    req: Request<{}, any, userModelParams>,
    res: Response
): Promise<void> => {
    const { firstName, lastName, email, mobileNo, password, confirmPassword } =
        req.body;

    const userRegistration = new USERLOG({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
        confirmPassword,
    });
    console.log("req.body:", userRegistration);

    try {
        // Check if email already exists
        const checkEmail = await USERLOG.findOne({ email });
        const checkMobile = await USERLOG.findOne({ mobileNo });
        console.log("checkEmail result:", checkEmail);
        if (checkEmail) {
            console.log("Email duplicate detected, exiting...");
            res.status(402).json({ message: "Email Already in use by another User" });
            return;
        }
        if (checkMobile) {
            console.log("Mobile duplicate detected, exiting...");
            res
                .status(401)
                .json({ message: "Mobile Already in use by another User" });
            return;
        }
        if (password !== confirmPassword) {
            // Check if passwords match
            console.log("Passwords do not match, exiting...");
            res.status(403).json({ message: "Password does not match" });
            return;
        }

        // Save the user and send success response
        console.log("Saving user to database...");
        await userRegistration.save();
        console.log("User saved successfully!");
        res.status(200).json({ message: "Registration created successfully" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: `Registration failed: ${err}` });
    }
};

export const userLogin = async (
    req: Request<{}, any, userLoginParams>,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log("req.body:", email, password);
        const user = await USERLOG.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Email a valid username" });
            return;
        }
        if (user.password !== password) {
            res.status(403).json({ message: "Enter a valid password" });
        }
        const token = user._id;
        console.log("user token", token);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: { err } });
    }
};
