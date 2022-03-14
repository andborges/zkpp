var express = require('express');
var tokenService = require('../../../services/tokenService');

const Account = require('../../../models/account');
const Feed = require('../../../models/feed');
const Session = require('../../../models/session');
const Vault = require('../../../models/vault');

var router = express.Router();

router.post('/', async function(req, res, next) {
    let existingAccount = await Account.findOne({ email: req.body.email });

    if (existingAccount) {
        res.status(400);
        res.json({ errorCode: "EmailAlreadyRegistered" });
        return;
    }

    try {
        let account = new Account();
        account.firstName = req.body.firstName;
        account.lastName = req.body.lastName;
        account.email = req.body.email;
        account.salt = req.body.salt;
        account.verifier = req.body.verifier;
        account.cipheredSecretKey = req.body.cipheredSecretKey;
        account.cipheredPublicKey = req.body.cipheredPublicKey;
    
        await account.save();

        let vault = new Vault();
        vault.accountId = account._id;
        vault.contentId = req.body.defaultFeed.id;
        vault.secretKey = req.body.defaultFeed.secretKey.cipher;
        vault.nonce = req.body.defaultFeed.secretKey.nonce;

        await vault.save();

        let defaultFeed = new Feed();
        defaultFeed.accountId = account._id;
        defaultFeed.contentId = req.body.defaultFeed.id;
        defaultFeed.isDefault = true
        defaultFeed.name = "Default"

        await defaultFeed.save();

        let session = new Session();
        session.accountId = account._id;

        await session.save();

        let token = tokenService.createToken(account, [vault], session, defaultFeed.contentId);

        res.json(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;