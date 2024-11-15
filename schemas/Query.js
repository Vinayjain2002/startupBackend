import graphql from 'graphql'
import { accessChat, fetchAllChats } from './queries/chatQueries.js';
import { getAllInvestors, getAllUser, getUser, login } from './queries/userQuery.js';
import { getAllStartUps, getStartUpbyId, NotFundedStartUp } from './queries/startUpQuery.js';
import { getAllPosts, getParticularPost, startUpPosts, userSpecificPosts } from './queries/postQueries.js';
import { getMessages } from './queries/messageQueries.js';
const { GraphQLObjectType } = graphql

const Query= new GraphQLObjectType({
    name: "Query",
    fields: {
        accessChat,
        fetchAllChats,
        login,
        getUser,
        getAllUser,
        getAllStartUps,
        getStartUpbyId,
        NotFundedStartUp,
        getAllPosts,
        userSpecificPosts,
        startUpPosts,
        getParticularPost,
        getMessages
    }
})

export default Query;