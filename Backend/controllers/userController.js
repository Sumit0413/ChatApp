import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullname, userName, password, confirmPassword, gender } = req.body;
        if (!fullname || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        await User.create({
            fullname,
            userName,
            password: hashedPassword,
            profilePic: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
        });
        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const Login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const existingUser = await User.findOne({ userName });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" ,success: false});
        }

        // Generate JWT token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).cookie("token", token, 
            { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
            message: "User logged in successfully",
            success: true,
            token,
            user: {
                _id: existingUser._id,
                fullname: existingUser.fullname,
                userName: existingUser.userName,
                profilePic: existingUser.profilePic,
            }
        });
    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const Logout = async (req, res) => {
    try{
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' })
            .json({ message: "User logged out successfully", success: true });
    } catch (error) {
        console.error("Error in user logout:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        // 1. Get the ID of the currently logged-in user
        const loggedInUserId = req.id;
        
        // 2. Find all users EXCEPT the logged-in one, excluding passwords
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        // 3. Return the list of other users
        return res.status(200).json(otherUsers);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        // Get the user ID from the middleware (req.id is set by isAuthenticated middleware)
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
