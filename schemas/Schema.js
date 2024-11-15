
import graphql from 'graphql'
import Query from './Query.js'
import Mutation from './Mutation.js'
import { GraphQLSchema } from 'graphql'

const {GraphQlSchema}= graphql;

export default new GraphQLSchema({
    query: Query,
    mutation: Mutation
})