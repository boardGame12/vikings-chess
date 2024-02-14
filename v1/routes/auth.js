import express from "express";
import { Register } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import { Login } from "../controllers/auth.js"
import { Logout } from "../controllers/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Register route -- POST request
router.post(
    "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("user_name")
        .not()
        .isEmpty()
        .withMessage("Your first name is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 characters long"),
    check("confirm_password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    Validate,
    Register
);

// Login route == POST request
router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    Validate,
    Login
);

// Route to handle POST requests for updating player stats
router.post("/updateStats", async (req, res) => {
    const { user_name, outcome, playTime } = req.body;

    if (!user_name || !outcome || !playTime) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        let user = await User.findOne({ user_name });

        if (!user) {
            user = new User({
                user_name,
                wins: 0,
                losses: 0,
                play_time: 0
            });
        }

        if (outcome === 'win') {
            user.wins++;
        } else if (outcome === 'loss') {
            user.losses++;
        } else {
            return res.status(400).json({ message: 'Invalid outcome.' });
        }

        user.play_time += playTime;

        await user.save();

        res.json({ message: 'Player stats updated successfully.' });
    } catch (error) {
        console.error('Error updating player stats:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Logout route ==
router.get('/logout', Logout);

export default router;
