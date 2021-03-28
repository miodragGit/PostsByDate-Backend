const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const defaultFilterSchema = new Schema({
    pageLimit: { type: Number},
    date: { type: Date },
    category: { type: String }
});

module.exports = mongoose.model('DefaultFilter', defaultFilterSchema);