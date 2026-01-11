import mongoose from 'mongoose';

export const initializeDBConnection = async () => {
    const { MONGO_DB_CONNECTION_URL: MONGO_DB_CONNECTION_URL } = process.env;
   
    if (!MONGO_DB_CONNECTION_URL) {
        throw new Error('Missing env variable - MONGO_DB_CONNECTION_URL...');
    }

    await mongoose.connect(MONGO_DB_CONNECTION_URL);

    mongoose.connection.on('Failed establishing MongoDB connection', (error) => {
        console.error(error);
    });
    
    mongoose.connection.once('open', () => {
        console.log('Established a new connection to MongoDB!');
    });
};