import graphql from 'graphql'
import { PostType } from '../Type.js'
import Post from '../../models/Posts.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList
} = graphql


export const getAllPosts={
    type: PostType,
    async resolve(parent, args, req){
        if(!req.isAuth){
            throw new Error("Unauthenticated User!");
        }   
        else{
            let posts= await Post.find();
            return posts;
        }
     }
}

export const userSpecificPosts={
    type: PostType,
    args: {
        userId : {type: GraphQLID}
    },
    async resolve(parent, args , req){
        if(!req.isAuth){
            throw new Error("User is not authenticated");
        }
        else{
            let posts= await Post.find({createdBy: userId});
            return posts;
        }
    }
}

export const startUpPosts={
    // getting all the posts that are posted by the specific StartUp
    type: PostType,
    args: {
        startUpId: {type: GraphQLID}
    },
    async resolve(parent, args, res){
        if(!req.isAuth){
            throw new Error("Unauthenticated User");
        }
        else{
            const posts= await Post.find({startUpId: startUpId});
            return posts
        }
    }
}

export const getParticularPost={
    // getting the post on the basis of the post id
    type: PostType,
    args: {
        postId: {type: GraphQLID}
    },
    async resolve(parent, args, req){
        const post= await Post.findById(postId);
        return post;
    }
}
