import mongoose, { mongo } from 'mongoose';

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log('Error connecting to the database. Exiting now...', error);
    }
}


export default connectDb;