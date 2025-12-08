const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post"
    }

},
    {
        timestamps: true,
        collection: "Like"
    }
)

module.exports = mongoose.model('Like', likeSchema);