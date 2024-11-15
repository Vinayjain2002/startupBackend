import graphql from 'graphql'
import { PostType } from '../Type.js';
import {GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType}  from 'graphql'

export const createPost= ({
    type: PostType,
    args: {
        
    },
    async resolve(parent,args,req){}
})

export const editPost= ({
    type: PostType,
    args: {

    },
    async resolve(parent,args,req){

    }
})

export const deletePost= ({
    type: PostType,
    args: {

    },
    async resolve(parent,args,req){

    }
})
