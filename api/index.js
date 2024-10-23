import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

const username = "vikas1234";
const password = "vikas1234";
const endpoint = "ccproject.cv84m44409nv.ap-south-1.docdb.amazonaws.com";
const file_path = "./global-bundle.pem";

const mongoUri = `mongodb://${username}:${password}@${endpoint}:27017/?tls=true&tlsCAFile=${file_path}&retryWrites=false&w=majority`;

// Connect to AWS DocumentDB using Mongoose
mongoose.connect(mongoUri, {
}).then(() => {
    console.log('Connected to AWS DocumentDB');
}).catch((err) => {
    console.error('Failed to connect to AWS DocumentDB', err);
});

    const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
    }
);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
