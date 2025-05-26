import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { generateToken } from '../utils/generateAccessToken';
import { asyncHandler } from '../utils/asyncHandler';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {    
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(401).json({ message: "User already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({ email, password: hashedPassword });
        await user.save();
        
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(501).json({ message: "Internal server error" });
    }
});

export const loginUser = asyncHandler (async(req:Request, res:Response) =>{
    
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email or Password is required"});
        }
        const user = await User.findOne({ email });
        if (!user){
        return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password as string);

        if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(user._id as string, user.email as string);
        const userWithoutPassword = await User.findOne({ email }).select('-password');

        return res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        return res.status(501).json({message:"Internal server error"})
    }
});