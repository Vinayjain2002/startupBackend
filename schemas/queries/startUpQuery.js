const graphql = require('graphql')
const {StartUpType}= require('../Type.js')
const StartUp = require('../../models/StartUp.js')

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList
} = graphql


const getAllStartUps={
    type: StartUpType,
    async resolve(parent, args){
        const allstartUp= await StartUp.find({});
        return allstartUp;
    }
} 

const getStartUpbyId= {
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


const NotFundedStartUp = {
    type: new GraphQLList(StartUpType),
    async resolve(parent, args) {
      const notFunded = await StartUp.find({ 'fundingDetails.totalFunding': { $eq: 0 } });
      return notFunded;
    }
  };

const searchStartUpsByLocation= {
    // need to be implemented
}

module.exports={
    NotFundedStartUp,
    getAllStartUps,
    getStartUpbyId,
    searchStartUpsByLocation
}