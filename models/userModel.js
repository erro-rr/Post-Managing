const mongoose = require('mongoose');
const { trim } = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: 0 // 0 for unverified and 1 for verified
    },
    image: {
        type: String,
        default: null
    },
    role: {
        type: Number,
        default: 0 // 0->User 1->Admin 2->Sub-Admin 3->Editior
    }
},
    {
        timestamps: true,
        collection: "User"
    }
)

module.exports = mongoose.model('User', userSchema);