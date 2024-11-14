const graphql = require('graphql')
const {UserType} = require('../Type.js')
const User= require('../../models/user.js')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs')
const StartUp = require('../../models/StartUp.js')


const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList
} = graphql

const login = {
    type: UserType,
    args: {
        email: {type:GraphQLString},
        password: {
            type: GraphQLString
        }
    },
    async resolve(parent,args){
        const query= await User.findOne({email: args.email});
        if(!query){
            throw new Error("User does not exists");
        }
        else{
            // trying to compare the password of the the user with the password of database
            let isEqual= await bcrypt.compare(args.password, query.password );
            if(!isEqual){
                throw new Error("Password is incorrect");
            }
            else{
                const accessToken= await jwt.sign({id: query._id, email: args.email},'accessToken', {
                    expiresIn: '4h'
                });
                const refreshToken= await jwt.sign({id: query.id, email: query.email},'refreshToken',{
                    expiresIn: '7d'
                });

                return {
                    name: query.name,
                    email: query.email,
                    accessToken: accessToken,
                    phoneNo: query.phoneNo,
                    achievements: query.achievements,
                    bio: query.bio,
                    profilePicture: query.profilePicture,
                    StartUp: query.StartUp,
                    refreshToken: refreshToken,
                    investments: query.investments,
                    portfolio: query.portfolio,
                    isInvestor: query.isInvestor
                }
            }
        }
    }
}

const getUser = {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated User");
      } else {
        // Fetch user by ID while excluding the password field
        let user = await User.findById(args.id).select('-password');
        return user;
      }
    }
  };
  
  
const getAllUser= {
    type: new GraphQLList(UserType),
    async resolve(parent,args, req){
        let users= await User.find({isInvestor: false});
        return users;
    }
}

const getAllInvestors= {
    type: new GraphQLList(UserType),
    async resolve(parent, args, req){
        let investors= await User.find({isInvestor: true});
        return investors;
    }
}

const getUserByLocation= {
    // need to be implemented
}

module.exports={
    getAllUser, 
    getAllInvestors,
    login,
    getUser
}
