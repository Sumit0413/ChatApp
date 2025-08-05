
import {Conversation} from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const {message} = req.body;
        const receiverID = req.params.id;

        let gotConversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverID]
            }
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants: [senderId, receiverID]
            });
        }

        const newMessage = await Message.create({
            senderID: senderId,
            receiverID: receiverID,
            message: message
        });
        
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
            await gotConversation.save();
        }

        res.status(200).json({ 
            message: "Message sent successfully",
            newMessage: newMessage 
        });

        //Socket.io logic can be added here to emit the new message to the recipient

    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({ error: error.message });
    }
};



export const getMessage = async (req, res) => {
    try { 
        const receiverID = req.params.id;
        const senderId = req.id;
        const gotConversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverID]
            }
        }).populate('messages');

        if (!gotConversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(gotConversation.messages);
    } catch (error) {
        console.log("Error in getMessage:", error);
        res.status(500).json({ error: error.message });
    }
};
