import graphql from 'graphql'
import { MessageType } from '../Type.js'
import Message from '../../models/messageModal.js'
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

export const getMessages= (
    {
        type: MessageType,
        args: {
            chatId: {type: GraphQLID}
        },
        async resolve(parent, args, req){
            if(!req.isAuth){
                throw new Error("Unauthenticated User");
            }
            else{
                const messages= await Message.find({chatId: chatId}).populate({
                    path: 'sender',
                    model: 'User',
                    select: 'name profilePicture email'
                }).populate({
                    path: 'chatId',
                    model: 'Chat'
                });

                return messages;
            }
        }
    }
);
