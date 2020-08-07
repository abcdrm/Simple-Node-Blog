/*jshint esversion: 8 */
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    preview: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Article', articleSchema)