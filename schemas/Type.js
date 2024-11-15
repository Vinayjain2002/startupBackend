import graphql from 'graphql'
import GraphQLDate from 'graphql-date'
import User from '../models/user.js'
import Chat from '../models/chatModal.js'
import StartUp from '../models/StartUp.js'
import Post from '../models/Posts.js'
import Message from '../models/messageModal.js'
import  {GraphQLJSON, GraphQLJSONObject} from 'graphql-type-json'

const {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
} = graphql


 const achievements= new GraphQLObjectType({
    name: 'Achievement',
    fields: ()=>({
            title: {type: new GraphQLNonNull(GraphQLString) },
            description: {type: new GraphQLNonNull(GraphQLString)},
            date: {type: GraphQLDate}
    })
});

// StartUpType definition
export  const StartUpType = new GraphQLObjectType({
    name: 'StartUp',
    fields: () => ({
      role: { type: GraphQLString },
      startUpName: { type: new GraphQLNonNull(GraphQLString) },
      startUpId: { 
        type: GraphQLID,
        resolve(parent, args) {
          // You can implement your resolver here if needed
          return parent.startUpId;
        }
      }
    })
  });
  
  // InvestmentType definition
  const InvestmentType = new GraphQLObjectType({
    name: 'Investment',
    fields: () => ({
      startUpId: { 
        type: new GraphQLNonNull(StartUpType),
        resolve(parent, args) {
          // Implement your resolver if necessary
          return StartUp.findById(parent.startUpId); // Example resolver
        }
      },
      investmentAmount: { type: new GraphQLNonNull(GraphQLInt) },
      date: { type: GraphQLDate }
    })
  });
  
  // PortfolioType definition
  const PortfolioType = new GraphQLObjectType({
    name: "Portfolio",
    fields: () => ({
      startUpId: { 
        type: StartUpType,
        resolve(parent, args) {
          return StartUp.findById(parent.startUpId); // Example resolver
        }
      },
      percentageOwnership: { type: new GraphQLNonNull(GraphQLInt) }
    })
  });
  
 export  const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: ()=>({
      id: {type: GraphQLID},
      accessToken: {type: GraphQLString},
      refreshToken: {type: GraphQLString},
      accessToken: {type: GraphQLDate},
      refreshToken: {type: GraphQLDate}
    })
  });
  
  // UserType definition
 export  const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      phoneNo: { type: GraphQLInt },
      achievements: { type: new GraphQLList(GraphQLString) }, // Assuming `achievements` is a list of strings
      bio: { type: GraphQLString },
      profilePicture: { type: GraphQLString },
      startUp: { 
        type: StartUpType,
        resolve(parent, args) {
          return StartUp.findById(parent.startUpId); // Adjust resolver if necessary
        }
      },
      refreshToken: { type: GraphQLString },
      investments: { type: new GraphQLList(InvestmentType) },
      portfolio: { type: new GraphQLList(PortfolioType) },
      isInvestor: { type: GraphQLBoolean }
    })
  });
  
  
export const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      imageUrl: { type: new GraphQLList(GraphQLString) },
      createdBy: { 
        type: UserType,
        resolve(parent, args) {
          return User.findById(parent.createdBy); // Fetch user by ID from `createdBy` field
        }
      },
      startUpId: { 
        type: StartUpType,
        resolve(parent, args) {
          return StartUp.findById(parent.startUpId); // Fetch startup by ID from `startUpId` field
        }
      },
      date: { type: GraphQLDate },
      likes: { 
        type: new GraphQLList(UserType),
        resolve(parent, args) {
          return User.find({ _id: { $in: parent.likes } }); // Fetch users who liked the post
        }
      },
      comments: { 
        type: new GraphQLList(
          new GraphQLObjectType({
            name: 'Comment',
            fields: () => ({
              userId: { 
                type: UserType,
                resolve(parent, args) {
                  return User.findById(parent.userId); // Fetch the user for each comment's `userId`
                }
              },
              comment: { type: GraphQLString },
              date: { type: GraphQLDate }
            })
          })
        )
      }
    })
  });
  
  

export   const ChatType = new GraphQLObjectType({
    name: "Chat",
    fields: () => ({
      id: { type: GraphQLID }, // Chat ID
      photo: { type: GraphQLString }, // Chat photo URL
      chatName: { type: GraphQLString }, // Name of the chat (if any)
      isGroup: { type: GraphQLBoolean }, // Whether it's a group chat
      users: { 
        type: new GraphQLList(UserType),
        resolve(parent, args) {
          // Fetch and return all users whose IDs are in the `users` array of the chat
          return User.find({ _id: { $in: parent.users } });
        }
      }, // List of users in the chat
      latestMessage: { type: MessageType }, // Latest message in the chat
      groupAdmin: { type: UserType,
        resolve(parent,args){
            return User.findById(parent.groupAdmin)
        }
       }, // Group admin (for group chats)
      createdAt: { type: GraphQLDate }, // Created date
      updatedAt: { type: GraphQLDate }, // Updated date
    })
  });

 export const MessageType= new GraphQLObjectType({
    name: "Message",
    fields:()=>({
      id: {type: GraphQLID},
      sender: {type: UserType},
      message: {GraphQLString},
      chatId: {type: ChatType}
    })
 })
