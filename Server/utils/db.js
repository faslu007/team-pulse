import mongoose from 'mongoose';

export async function connectDB () {
    try {
        console.log(process.env.DEV_MONGO_URI)
        const conn = await mongoose.connect(['local', 'development'].includes(process.env.NODE_ENV) ? process.env.DEV_MONGO_URI : process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected Successfully.`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
};