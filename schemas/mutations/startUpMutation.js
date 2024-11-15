import graphql from 'graphql'
import {StartUpType} from '../Type.js'
import GraphQLDate from 'graphql-date'
import StartUp from '../../models/StartUp.js'

const { GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} = graphql


export const createStartUpPage= ({
    type: StartUpType,
    args: {
        startUpName: new GraphQLNonNull(GraphQLString),
        isRegistered: graphql.GraphQLBoolean,
        isVerified: graphql.GraphQLBoolean,
        founder: GraphQLID,
        customerBase: GraphQLInt,
        // fundingDetails: new 
        
    },
    async resolve(parent,args,req){

    }
})

export const updateStartUpPage= ({
    type: StartUpType,
    args: {

    },
    async resolve(parent,args, req){

    }
})

export const deleteStartUpPage= ({
    type: StartUpType,
    args: {

    },
    async(parent, args, req){

    }
})
