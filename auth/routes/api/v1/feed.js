var express = require('express');
var tokenService = require('../../../services/tokenService');

const Feed = require('../../../models/feed');
const FeedItem = require('../../../models/feedItem');

var router = express.Router();

router.post('/:contentId', async function(req, res, next) {
    var token = tokenService.readToken(req.header('Authorization'));

    if (!token) {
        res.status(401).send();
    }

    try {
        let feed = await Feed.findOne({ accountId: token.id, contentId: req.params.contentId });
        
        let feedItem = new FeedItem();
        feedItem.feedId = feed._id;
        feedItem.nonce = req.body.nonce;
        feedItem.content = req.body.content;

        await feedItem.save();

        res.json(feedItem);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/:contentId', async function(req, res, next) {
    var token = tokenService.readToken(req.header('Authorization'));

    if (!token) {
        res.status(401).send();
    }

    try {
        let feed = await Feed.findOne({ accountId: token.id, contentId: req.params.contentId });
        let feedItems = await FeedItem.find({ feedId: feed._id }).select({ nonce: 1, content: 1, createdAt: 1 });

        res.json(feedItems);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;