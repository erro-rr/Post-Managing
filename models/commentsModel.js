const mongoose = require('mongoose');
const commentScehma = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Post'
    },
    comment: {
        type: String,
        required: true
    }

},
    {
        timestamps: true,
        collection: "Comments"
    }
)

module.exports = mongoose.model('Comments', commentScehma);