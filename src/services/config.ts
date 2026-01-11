import dotenv from 'dotenv';

type Config = {
    PORT: string;
    MONGO_DB_CONNECTION_URL: string;
    REFRESH_TOKEN_EXPIRES_SEC: number;
    ACCESS_TOKEN_EXPIRES_SEC: number;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
};

const REQUIRED_ENVIRONMENT_VARIABLES = [
    "PORT",
    'MONGO_DB_CONNECTION_URL',
    'JWT_ACCESS_SECRET',
    'ACCESS_TOKEN_EXPIRES_SEC',
    'REFRESH_TOKEN_EXPIRES_SEC',
    'JWT_REFRESH_SECRET',
];


let config: Config;

export const getConfig = () => {
    if (!config) {
        dotenv.config();
        checkEnvironmentVariables();
        
        const { env } = process as { env: Record<string, string> };
        
        config = {
            PORT: env.PORT || '8080',
            MONGO_DB_CONNECTION_URL: env.MONGO_DB_CONNECTION_URL,
            REFRESH_TOKEN_EXPIRES_SEC: parseInt(env.REFRESH_TOKEN_EXPIRES_SEC) || 60*60,
            ACCESS_TOKEN_EXPIRES_SEC: parseInt(env.ACCESS_TOKEN_EXPIRES_SEC) || 60*60*24,
            JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
            JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
        };
    }
    
    return config;
};

const checkEnvironmentVariables = () => {
    if (REQUIRED_ENVIRONMENT_VARIABLES.some((variable) => !(variable in process.env))) {
        const missingVariables = REQUIRED_ENVIRONMENT_VARIABLES.find((variable) => !(variable in process.env));
        throw new Error(`missing environment variable: ${missingVariables}`);
    }
};