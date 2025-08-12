import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/dbConnect.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';


dotenv.config();
const PORT = process.env.PORT|| 7000;
const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
});

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);

// Store online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('addUser', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} added with socket ${socket.id}`);
        
        // Broadcast updated online users list
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
        const { receiverId, message, senderId } = data;
        const receiverSocketId = onlineUsers.get(receiverId);
        
        if (receiverSocketId) {
            // Send message to specific user
            io.to(receiverSocketId).emit('receiveMessage', {
                senderId,
                message,
                createdAt: new Date()
            });
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        // Remove user from online users
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        
        // Broadcast updated online users list
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });
});

app.get('/',(req,res)=>{
    console.log('Hello World');
    res.send('Hello World');
});

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})