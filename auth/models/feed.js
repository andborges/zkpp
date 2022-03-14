var mongoose = require('mongoose');

var feedSchema = mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contentId: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('feed', feedSchema);