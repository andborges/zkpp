var express = require('express');
var tokenService = require('../../../services/tokenService');

const Account = require('../../../models/account');
const Feed = require('../../../models/feed');
const Session = require('../../../models/session');
const Vault = require('../../../models/vault');
const Zkpp = require('../../../models/zkpp');

// RFC 5054 2048bit constants
const rfc5054 = {
    N_base10: "21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819",
    g_base10: "2", 
    k_base16: "5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300"
}

var router = express.Router();

router.post('/challenge', async function(req, res, next) {
    let account = await Account.findOne({ email: req.body.email });

    if (!account) {
        res.status(401).json();
        return;
    }

    let SRP6JavascriptServerSession = require('thinbus-srp/server')(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);
    let srpServer = new SRP6JavascriptServerSession();

    let B = srpServer.step1(account.email, account.salt, account.verifier);

    let zkpp = new Zkpp();
    zkpp.accountId = account._id;
    zkpp.state = JSON.stringify(srpServer.toPrivateStoreState());

    await zkpp.save();

    res.json({ salt: account.salt, B });
});

router.post('/authenticate', async function(req, res, next) {
    let account = await Account.findOne({ email: req.body.email });

    if (!account) {
        res.status(401).json({ errorCode: "InvalidUsernameOrPassword" });
        return;
    }

    let zkpp = await Zkpp.findOne({ accountId: account._id });

    if (!zkpp) {
        res.status(401).json({ errorCode: "InvalidUsernameOrPassword" });
        return;
    }

    let SRP6JavascriptServerSession = require('thinbus-srp/server')(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);
    let srpServer = new SRP6JavascriptServerSession();

    srpServer.fromPrivateStoreState(JSON.parse(zkpp.state));

    try {
        srpServer.step2(req.body.A, req.body.M1);

        let defaultFeed = await Feed.findOne({ isDefault: true });
        let vault = await Vault.find({ accountId: account._id }).select({ contentId: 1, secretKey: 1, nonce: 1, _id: 0 });

        let session = new Session();
        session.accountId = account._id;
    
        await session.save();
    
        let token = tokenService.createToken(account, vault, session, defaultFeed.contentId);
    
        res.json(token);
    } catch (error) {
        console.log(error);
        res.status(401).json({ errorCode: "InvalidUsernameOrPassword" });
    } finally {
        await zkpp.remove();
    }
});

module.exports = router;
