const graphql= require('graphql')
const { GraphQLObjectType } = graphql

const Query= new GraphQLObjectType({
    name: "Query",
    fields: ()=>{

    }
})

module.exports= Query;