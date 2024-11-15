import graphql from 'graphql'
import { StartUpType } from '../Type.js'
import StartUp from '../../models/StartUp.js'

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList
} = graphql


export const getAllStartUps={
    type: StartUpType,
    async resolve(parent, args){
        const allstartUp= await StartUp.find({});
        return allstartUp;
    }
} 

export const getStartUpbyId= {
    type: StartUpType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    async resolve(parent,args){
        const startUp= await StartUp.findById(args.id);
        return startUp;
    }
}


export const NotFundedStartUp = {
    type: new GraphQLList(StartUpType),
    async resolve(parent, args) {
      const notFunded = await StartUp.find({ 'fundingDetails.totalFunding': { $eq: 0 } });
      return notFunded;
    }
  };

const searchStartUpsByLocation= {
    // need to be implemented
}

