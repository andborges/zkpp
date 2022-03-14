var mongoose = require('mongoose');
var moment = require('moment');

var sessionSchema = mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    accessToken: {
        type: String,
        default: require('crypto').randomBytes(64).toString('hex')
    },
    createdAt: {
        type: Date,
        default: function () { return moment().utc(); }
    },
    expiresAt: {
        type: Date,
        default: function () { return moment().add(1, 'd').utc(); }
    }
});

module.exports = mongoose.model('session', sessionSchema);