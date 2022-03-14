var jwt = require('jsonwebtoken');

module.exports.createToken = function (account, vault, session, defaultContentId) {
    let data = {
        id: account._id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        cipheredSecretKey: account.cipheredSecretKey,
        cipheredPublicKey: account.cipheredPublicKey,
        vault: vault,
        accessToken: session.accessToken,
        defaultContentId: defaultContentId
    }

    let secret = "zW7zWHEVGDqF32sLvERqBzR4KbNfgCU9zKqBZSekKV5VfcC8WKMQdRb73s8hXQQ6stQQPgN8cN7N6WZGbjuye8hfKN7bnbqQgj2AhdhYqQyrLKNcakRJNbQLyxebxTANDzz2YremMSzH84t4RuwmbFuApEj82uFajkkCUfcKkyjTaEKSukSyVxXBHNddjrpjsUdTkuWE3w8WvFvdUhN8b38nTWQYnRX66VPCYxt2QNH3W3GS7ABuqLL2uRcMPKQg";

    return jwt.sign(data, secret, { expiresIn: '1d' });
}

module.exports.readToken = function (header) {
    let secret = "zW7zWHEVGDqF32sLvERqBzR4KbNfgCU9zKqBZSekKV5VfcC8WKMQdRb73s8hXQQ6stQQPgN8cN7N6WZGbjuye8hfKN7bnbqQgj2AhdhYqQyrLKNcakRJNbQLyxebxTANDzz2YremMSzH84t4RuwmbFuApEj82uFajkkCUfcKkyjTaEKSukSyVxXBHNddjrpjsUdTkuWE3w8WvFvdUhN8b38nTWQYnRX66VPCYxt2QNH3W3GS7ABuqLL2uRcMPKQg";

    var headerParts = header.split(' ');

    try {
        return jwt.verify(headerParts[1], secret);
    } catch (err) {
        return null;
    }
}