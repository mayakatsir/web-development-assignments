import mongoose from 'mongoose';
import { getConfig } from './config';

const config = getConfig();

export const initializeDBConnection = async () => {
    await mongoose.connect(config.MONGO_DB_CONNECTION_URL);

    mongoose.connection.on('Failed establishing MongoDB connection', (error) => {
        console.error(error);
    });
    
    mongoose.connection.once('open', () => {
        console.log('Established a new connection to MongoDB!');
    });
};