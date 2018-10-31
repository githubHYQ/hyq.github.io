var mongoose = require('mongoose')

// Schema
var postSchema = mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pv: {
        type: Number,
        default: 0
    },
    createdTime: {
        type: Date,
        default: Date.now()
    },
    comments: {
        type: Number,
        default: 0
    }
})

exports.Post = mongoose.model('Post', postSchema)