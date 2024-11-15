import graphql from 'graphql'
import { MessageType } from '../Type.js'
import Message from '../../models/messageModal.js'

const { GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    
} = graphql

export const sendMessage= ({
    type: MessageType,
    args: {
        chatId: {type: GraphQLID}
    },
    async resolve(parent,args,req){
        try{
            const message= await Message.find({chatId: chatId}).populate({
                path: 'sender',
                model: 'User',
                select: 'name profilePic email'
            }).populate({
                path: 'chatId',
                model: 'Chat'
            })
            return message;
        }       
        catch(err){
            throw new Error("Error while getting the message")
        }
    }
}) 
