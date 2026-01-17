import jwt from 'jsonwebtoken';
import { getConfig } from './config';

const config = getConfig();

type Tokens = {
    token: string;
    refreshToken: string;
}

export const generateToken = (userId: string): Tokens => {
    const jwtSecret: string = config.JWT_ACCESS_SECRET;
    const jwtRefreshSecret: string = config.JWT_REFRESH_SECRET;
    const accessTokenExpiresSec: number = config.ACCESS_TOKEN_EXPIRES_SEC; 
    const refreshTokenExpiresSec: number = config.REFRESH_TOKEN_EXPIRES_SEC;

    const token = jwt.sign(
        { userId: userId },
        jwtSecret,
        { expiresIn: accessTokenExpiresSec }
    );

    const refreshToken = jwt.sign(
        { userId: userId },
        jwtRefreshSecret,
        { expiresIn: refreshTokenExpiresSec }
    );
    return { token, refreshToken };
}
