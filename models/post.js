const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const postSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String },
    date: { type: Date, required: true},
    //category: { type: String, required: true }
    category: {
        id: { type: String, required: true },
        title: { type: String, required: true }
    }
});

module.exports = mongoose.model('Post', postSchema);