import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/dbConnect.js';
import userRoute from './routes/userRoute.js';


dotenv.config();
const PORT = process.env.PORT|| 7000;
const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/v1/user",userRoute); 

app.get('/',(req,res)=>{
    console.log('Hello World');
    res.send('Hello World');
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})