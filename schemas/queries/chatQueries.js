import graphql from 'graphql'
import { ChatType, MessageType } from '../Type.js'
import Chat from '../../models/chatModal.js'
import User from '../../models/user.js'

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList
} = graphql


export const accessChat = {
    type: MessageType,
    args: {
        userId: { type: GraphQLID }
    },
    async resolve(parent, args, req) {
        if (!req.isAuth) {
            throw new Error("Unauthorised User Found");
        }
        let chatExists = await Chat.find({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: args.userId } } },
                { users: { $elemMatch: { $eq: req.rootUserId } } }
            ]
        })
        .populate('users', '-password')
        .populate('latestMessage');

        // populating once again for the details of the sender of the latest message
        chatExists = await User.populate(chatExists, {
            path: 'latestMessage.sender',
            select: 'name email profilePic'
        });

        if (chatExists.length > 0) {
            return chatExists[0];
        } else {
            // Chat does not exist
            const data = {
                chatName: 'sender',
                users: [args.userId, req.rootUserId],
                isGroup: false
            };

            // Create a new chat
            try {
                const newChat = await Chat.create(data);
                const chat = await Chat.find({ _id: newChat._id }).populate('users', '-password');
                return chat[0];
            } catch (err) {
                throw new Error("Error Occurred");
            }
        }
    }
};

export const fetchAllChats=
    {
        // going to fetch all the chats of the user
        type: ChatType,
        args: {
    
        },
        async resolve(parent, args, req){
            // finding the chatsof the user Id
            let chats= await Chat.find({users: {$elemMatch: {$eq: req.rootUserId}}}).populate('users').populate('latestMessage').populate('groupAdmin');

            const finalChats= await User.populate(chats, {
                path: 'latestMessage.sender',
                select: 'name email profilePic'
            })
            return finalChats;
        }
    }   