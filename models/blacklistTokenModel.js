const mongoose = require('mongoose');

const blacklistTokenModel = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }

},
    {
        timestamps: true,
        collection: "blacklistTokenModel"
    }
)


module.exports = mongoose.model('blacklistTokenModel', blacklistTokenModel);