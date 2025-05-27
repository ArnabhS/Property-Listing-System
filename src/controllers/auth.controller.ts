import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateToken } from '../utils/generateAccessToken';



export const registerUser = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {    
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ message: "Please fill in all fields" });
            return;
        }

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            res.status(401).json({ message: "User already registered" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({ email, password: hashedPassword });
        await user.save();
        
        res.status(201).json({ success:true, message: 'User registered successfully' });
        return;
    } catch (error) {
        res.status(501).json({ success:false, message: "Internal server error" });
        next(error);
        return;
    }
}

export const loginUser = async(req:Request, res:Response,next:NextFunction):Promise<void> =>{
    
    try {
        const { email, password } = req.body;
        if(!email || !password){
            res.status(400).json({message:"Email or Password is required"});
            return;
        }
        const user = await User.findOne({ email });
        if (!user){
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password as string);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = generateToken(user._id as string, user.email as string);
        const userWithoutPassword = await User.findOne({ email }).select('-password');

        res.status(200).json({ success:true, user: userWithoutPassword, token });
        return;
    } catch (error) {
        res.status(501).json({success:false, message:"Internal server error"})
        next(error);
        return;
    }
}