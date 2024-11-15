const {GraphQLObjectType} = graphql;
import graphql from 'graphql'
import { addToGroup, createGroup, removeFromGroup, renameGroup } from './mutations/chatMutation.js';
import { sendMessage } from './mutations/messageMutation.js';
import { createPost, deletePost, editPost } from './mutations/postMutation.js';
import { createStartUpPage, deleteStartUpPage, updateStartUpPage } from './mutations/startUpMutation.js';
import { blockUser, createUser, deleteAccount, generateToken, updateProfile } from './mutations/userMutation.js';

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createGroup,
        renameGroup,
        addToGroup,
        removeFromGroup,
        sendMessage,
        createPost,
        editPost,
        deletePost,
        createStartUpPage,
        updateStartUpPage,
        deleteStartUpPage,
        createUser,
        generateToken,
        updateProfile,
        deleteAccount,
        blockUser
    }
});

export default Mutation;