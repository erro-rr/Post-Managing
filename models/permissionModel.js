const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    permission: [
        {
            permission_name: String,
            permission_value: [Number] // // 0 -> Create , 1->Read , 2->Edit , 3->Delete
        }
    ]

},
    {
        timestamps: true,
        collection: "Permission"
    }
)

module.exports = mongoose.model('Permission', permissionSchema);