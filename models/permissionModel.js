const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    permission_name:{
        type:String,
        required:true

    },
    isDefault:{
        type:Number,
        default:0 // 0 -Not Default 1- Default
    }

},{
    timestamps:true,
    collection:"Permission"
})

module.exports = mongoose.model('Permission',permissionSchema);