import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConnect.js';


dotenv.config();
const PORT = process.env.PORT|| 7000;
const app = express();

connectDB();


app.get('/',(req,res)=>{
    console.log('Hello World');
    res.send('Hello World');
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})