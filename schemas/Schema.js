const graphql = require('graphql')
const Query= require('./Query.js')
const Mutation = require('./Mutation.js');
const { GraphQLSchema } = require('graphql');

const {GraphQlSchema}= graphql;

module.exports=new GraphQLSchema({
    query: Query,
    mutation: Mutation
})