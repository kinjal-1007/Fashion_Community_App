const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User=require("./user.js");

const commentSchema = new Schema({
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Comment', commentSchema);
