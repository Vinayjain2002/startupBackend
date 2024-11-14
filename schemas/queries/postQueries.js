const graphql = require('graphql')
const {PostType} = require('../Type.js')
const Post = require('../../models/Posts.js')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs')

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList
} = graphql


const getAllPosts={

}

