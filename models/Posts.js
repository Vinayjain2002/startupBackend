import mongoose from "mongoose";

const postSchema= mongoose.Schema({
    title:{
        type: String,
    },
    content: {
        type: String,
    },
    imageUrl: [
        {
            type: String
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startUpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StartUp'
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timeStamps: true
})

postSchema.methods.likePost= function (userId){
    if(this,likes.includes(userId)){
        this.likes.pull(userId);
    }
    else{
        this.likes.push(userId);
    }
    return this.save();
}

postSchema.methods.addComment= function (userId, commentText){
    const comment= {
        userId,
        comment: commentText
    }
}

const Post=  mongoose.model("Post", postSchema)
export default Post