var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    salt:  {
        type: String,
        required: true
    },
    verifier:  {
        type: String,
        required: true
    },
    cipheredSecretKey:  {
        type: String,
        required: true
    },
    cipheredPublicKey:  {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Account = module.exports = mongoose.model('account', accountSchema);

module.exports.get = function (callback, limit) {
    Account.find(callback).limit(limit);
}