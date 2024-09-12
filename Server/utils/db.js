import mongoose from 'mongoose';
import chalk from 'chalk';

export async function connectDB () {
    try {
        const conn = await mongoose.connect(['local', 'development'].includes(process.env.NODE_ENV) ? process.env.DEV_MONGO_URI : process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(chalk.blue(`MongoDB Connected Successfully.`));
    } catch (error) {
        console.log(chalk.red.bold('Error connecting to MongoDB:'), error);
        process.exit(1)
    }
};