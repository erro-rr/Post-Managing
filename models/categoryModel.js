const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
        collection: "Category"
    }
)

module.exports = mongoose.model("Category", categorySchema);