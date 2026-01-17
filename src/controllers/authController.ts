import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../services/auth";
import userRepository from "../repositories/userRepository";
import { getConfig } from "../services/config";

const config = getConfig();

class AuthController {
async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) 
        return res.status(400).json({ message: 'body param is missing (username or email or password)' });

    if(await userRepository.isUsernameExists(username)){
        return res.status(400).send({ message: `username: ${username} already exists` });
        
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const user = await userRepository.createUser(username, email, encryptedPassword );
        const tokens = generateToken(user._id.toString());

        user.refreshToken.push(tokens.refreshToken);
        await user.save();

        res.status(200).json(tokens);
    } catch (error) {
        return res.status(401).json({ message: "Registration failed" });
    }
};

async login (req: Request, res: Response) {
    try {
    const { username, password } = req.body;

    if (!username || !password) {
        return  res.status(400).json({ message: 'body param is missing (username or password)' });
    }

        const user = await userRepository.getUserByUsername(username);

        if (!user) {
            return res.status(400).send({ message: `Invalid username or password` })}

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: `Invalid username or password` });
        }

        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        await user.save();

        res.status(200).json(tokens);
    } catch (error) {
        return res.status(400).send({ message: `Login failed` });
    }
};

async refreshToken (req: Request, res: Response) {
    try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).send({ message: `Refresh token is required` });

    }

        const secret: string = config.JWT_REFRESH_SECRET;
        const decoded: any = jwt.verify(refreshToken, secret);
        const user = await userRepository.getUserById(decoded.userId);
        
        if (!user) {
           return res.status(400).send({ message: `Invalid Refresh token` });
        }
        
        if (!user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            return res.status(400).send({ message: `Invalid Refresh token` });
        }

        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        user.refreshToken = user.refreshToken.filter((rt:string) => rt !== refreshToken);
        await user.save();

        res.status(200).json(tokens);
    } catch (error) {
        return res.status(400).send({ message: `Invalid Refresh token` });

    }
};

async logout (req: Request, res: Response) {
    try {
        const { refreshToken } = req.body;
    
        if (!refreshToken) {
            return res.status(400).send({ message: `Refresh token is required` });
        } 

        const secret: string = config.JWT_REFRESH_SECRET;
        const decoded: any = jwt.verify(refreshToken, secret);      
        const user = await userRepository.getUserById(decoded.userId);

        if (user) {
            user.refreshToken = user.refreshToken.filter((rt:string) => rt !== refreshToken);
            await user.save();
        }   

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(400).send({ message: `Invalid Refresh token` });
    }
};
}


export default new AuthController;