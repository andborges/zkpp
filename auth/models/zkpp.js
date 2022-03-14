var mongoose = require('mongoose');

var zkppSchema = mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    state: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('zkpp', zkppSchema);