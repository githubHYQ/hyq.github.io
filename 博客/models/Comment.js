var mongoose = require('mongoose')

// Schema
var commentSchema = mongoose.Schema({
    postId: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdTime: {
        type: Date,
        default: Date.now()
    }
})

exports.Comment = mongoose.model('Comment', commentSchema)