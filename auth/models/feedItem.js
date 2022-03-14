var mongoose = require('mongoose');

var feedItemSchema = mongoose.Schema({
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    nonce: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('feedItem', feedItemSchema);