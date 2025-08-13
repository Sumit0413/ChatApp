import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { SocketContext } from './SocketContext.js';

export const SocketProvider = ({ children, user }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:7000";

    useEffect(() => {
        let newSocket = null;

        if (user?._id) {
            // Create socket connection
            newSocket = io(socketUrl, {
                withCredentials: true
            });

            // Add user to online users
            newSocket.emit('addUser', user._id);

            // Listen for online users updates
            newSocket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });

            setSocket(newSocket);
        } else {
            setSocket(null);
            setOnlineUsers([]);
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [user?._id, socketUrl]);

    const sendMessage = useCallback((receiverId, message) => {
        if (socket && user) {
            socket.emit('sendMessage', {
                senderId: user._id,
                receiverId,
                message
            });
        }
    }, [socket, user]);

    const value = {
        socket,
        onlineUsers,
        sendMessage
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
