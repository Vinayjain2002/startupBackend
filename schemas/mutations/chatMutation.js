import Chat from '../../models/chatModal.js' 
import {ChatType} from '../Type.js'
import graphql from 'graphql'
const { GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} = graphql


export const createGroup=({
    type: ChatType,
    args: {
        chatName: {type: GraphQLString},
        users: {type: new GraphQLList(GraphQLID)}
    },
    async resolve(parent,args,req){
        // definning the logic to create the chat
        const parsedUsers= JSON.parse(users);
        if(parsedUsers.length < 2){
            // it's like the one to one chat
            throw new Error("Group is created by more than 2 persons")
        }
        parsedUsers.push(req.rootUser);
        try{
            const chat= await Chat.create({
                chatName: chatName,
                users: parsedUsers,
                isGroup: true,
                groupAdmin: req.rootUserId
            });
            const createdChat= await Chat.findOne({_id: chat._id}).populate('users', '-password').populate('groupAdmin', '-password');
            return createdChat;
        }  
        catch(err){
            throw new Error("Error While Creating Group")
        } 
    }
})

export const renameGroup= ({
    type: ChatType,
    args: {
        chatId: {type: new GraphQLNonNull(GraphQLID)},
        // this seems to be the new ChatName given to the chat
        chatName: {type: GraphQLString}
    },
    async resolve(parent, args, req){
        // renaming the grp
        const chat= await Chat.findByIdAndUpdate(args.chatId,{$set: {chatName: args.chatName}}).populate('users', '-password').populate('groupAdmin', '-password');
        if(!chat){
            return chat;
        }
    }
})

export const addToGroup=({
    type: ChatType,
    args: {
            userId: {type: GraphQLID},
            chatId: {type: GraphQLID}
    },
    async resolve(parent,args,req){
        const existing= await Chat.findById(args.chatId);
        if(!existing){
            throw new Error("Chat not found");
        }

        if(!existing.users.includes(userId)){
            const chat= await Chat.findByIdAndUpdate(chatId,{
                $push: {users: userId}
            }).populate('groupAdmin', '-password').populate('users', '-password');
            if(!chat){
                throw new Error("User not found");
            }
            else{
                // so the user is now in the chat
                return chat;
            }
        }
    }
})

export const removeFromGroup = {
    type: ChatType,
    args: {
        chatId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, req) {
        try {
            // Find the existing chat
            const existing = await Chat.findById(args.chatId);
            if (!existing) {
                throw new Error("Chat not found");
            }

            // Check if the user is part of the chat
            if (existing.users.includes(args.userId)) {
                // Remove the user from the chat's user list
                const chat = await Chat.findByIdAndUpdate(
                    args.chatId,
                    { $pull: { users: args.userId } },
                    { new: true }
                )
                .populate('groupAdmin', '-password')
                .populate('users', '-password');
                
                return chat;
            } else {
                throw new Error("User is not part of the chat");
            }

        } catch (err) {
            throw new Error(err.message);
        }
    }
};
