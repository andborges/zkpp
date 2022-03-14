var mongoose = require('mongoose');

var vaultSchema = mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contentId: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: true
    },
    nonce: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('vault', vaultSchema);