
import StartUp from '../../models/StartUp.js'
import User from '../../models/user.js'
import GraphQLDate from 'graphql-date'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import graphql from 'graphql'
import { UserType,AuthType } from '../Type.js'
const { GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} = graphql

export const createUser=( {
    type: UserType,
    args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        phoneNo: {type: GraphQLInt},
    },
    async resolve(parent,args, req){
        let user= await User.findOne({email: args.email});
        if(user){
            throw new Error("User Already exists");
        }
        else{
            let passHash= await bcrypt.hash(args.passHash, 12)
            const accessToken= await jwt.sign({email: args.email}, 'accessToken',{
                expiresIn: '4h'
            });
            const refreshToken= await jwt.sign({email: args.email}, 'refreshToken',{
                expiresIn: '7d'
            });

            let user= new User({
                name: args.name,
                email: args.email,
                phoneNo: args.phoneNo
            });

            let newUser= await user.save();
            return newUser;
        }
    }
});

export const generateToken= ({
    type: UserType,
    args: {
        refreshToken: {type: new GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent,args,req){
        if(!args.refreshToken){
            throw new Error("Not a refresh Token");
        }
        else{
            const decoded= jwt.verify(refreshToken,'yourSecretKey');
            let user= await User.findById(decoded._id);
            const accessToken= await jwt.sign({email: user.email}, 'accessToken', {
                expiresIn: '4h'
            })
            const refreshToken= await jwt.sign({
                email: user.email,
            },'refreshToken',{expiresIn: '7d'})
            return {
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                achievements: user.achievements,
                bio: user.bio,
                profilePicture: user.profilePicture,
                startUp: user.startUp,
                accessToken: accessToken,
                refreshToken: refreshToken,
                investments: user.investments,
                portfolio: user.portfolio,
                isInvestor: user.isInvestor
            }
        }
    }
})

// Define input type for achievements
const AchievementInputType = new GraphQLObjectType({
    name: 'AchievementInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLString }
    }
});

const StartUpInputType= new GraphQLObjectType({
    name: 'StartUpInput',
    fields: {
        role: {type: GraphQLString},
        StartUpName: {type:GraphQLString},
        startUpId: {type: GraphQLID}
    }
});

const portfolioInputType= new GraphQLObjectType({
    name: 'portfolioInput',
    fields: {
        startUpId: {
            type: GraphQLID
        },
        percentageOwnership: {
            type: GraphQLInt
        }
    }
})

const investmentsInputType= new GraphQLObjectType({
    name: 'investmentType',
    fields: {
        startUpId: GraphQLID,
        investmentAmount: GraphQLInt,
        date: GraphQLDate
    }
})

export const updateProfile= ({
    type: UserType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        phoneNo: {type:  GraphQLInt},
        achievements: {typr: AchievementInputType},
        bio: {type: GraphQLString},
        profilePicture: {type: GraphQLString},
        StartUp: {type: StartUpInputType},
        isInvestor: {type: graphql.GraphQLBoolean},
        portfolio: {type:  new GraphQLList(portfolioInputType)},
        investments: {type: new GraphQLList(investmentsInputType)}
    },
    async resolve(parent,args,req){
        if(!args.id){
            throw new Error("Id is not given")
        }
        let user= await User.findByIdAndUpdate(args.id,{
            id: args.id,
            name: args.name,
            phoneNo: args.phoneNo,
            achievements: args.achievements,
            bio: args.bio,
            profilePicture: args.profilePicture,
            StartUp: args.StartUp,
            isInvestor: args.isInvestor,
            portfolio: args.portfolio,
            investments: args.investments
        });
        // data of the user had been updated Successfully
        return user;
    }
});

export const deleteAccount=({
    type: UserType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(parent,args,req){
        if(!args.id){
            throw new Error("Id is not given");
        }
        let deletedUser= await User.findByIdAndRemove(args.id).exec();
        return deletedUser;
    }
})


export const blockUser= ({
    type: UserType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(parent, args,req){
        if(!args.id){
            throw new Error("Id is not given")
        }
        else{
            // going to block the user
            let user= await User.findByIdAndUpdate(args.id,{
                isBlocked: true
            },{new: true})
            return user;
        }
    }
})
