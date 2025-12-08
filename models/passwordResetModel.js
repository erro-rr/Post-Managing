const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    email: {
        type: String,
        required:true
    },
    token: {
        type: String,
        default: true
    },

},
    { timestamps: true,
      collection: "password_reset" // fixed name
     }

)
module.exports = mongoose.model('passwordResetModel', passwordResetSchema);