import nacl from 'tweetnacl';
import { encode as base64Encode, decode as base64Decode } from '@stablelib/base64';
import { encode as utf8Encode, decode as utf8Decode } from '@stablelib/utf8';

const useCrypto = () => {
 const deriveSymmetricKey = (salt, email, password) => {
    return window.crypto.subtle
            .importKey('raw', utf8Encode(email + password), { 'name': 'PBKDF2' }, false, ['deriveKey'])
            .then(function(baseKey) {
              return window.crypto.subtle.deriveKey(
                { 'name': 'PBKDF2', 'salt': utf8Encode(salt), 'iterations': 1000, 'hash': 'SHA-512' },
                baseKey,
                { 'name': 'AES-CBC', 'length': 128 },
                true,
                ['encrypt', 'decrypt']
              );
            });
  };

  const createKeyPair = () => {
    return nacl.box.keyPair();
  };

  const closeKeyPair = (keyPair, symmetricKey, iv) => {
    const secretKey = window.crypto.subtle.encrypt(
      {
          name: "AES-CBC",
          iv: utf8Encode(iv.substr(0, 16))
      },
      symmetricKey,
      keyPair.secretKey
    );
  
    const publicKey = window.crypto.subtle.encrypt(
      {
          name: "AES-CBC",
          iv: utf8Encode(iv.substr(0, 16))
      },
      symmetricKey,
      keyPair.publicKey
    );
  
    return Promise.all([secretKey, publicKey]).then(function (values) {
      return Promise.resolve({
        secretKey: base64Encode(new Uint8Array(values[0])),
        publicKey: base64Encode(new Uint8Array(values[1]))
      });
    });
  };
  
  const openKeyPair = (cipheredAsymmetricKeyPair, symmetricKey, iv) => {
    const secretKey = window.crypto.subtle.decrypt(
      {
          name: "AES-CBC",
          iv: utf8Encode(iv.substr(0, 16))
      },
      symmetricKey,
      base64Decode(cipheredAsymmetricKeyPair.secretKey)
    );
  
    const publicKey = window.crypto.subtle.decrypt(
      {
          name: "AES-CBC",
          iv: utf8Encode(iv.substr(0, 16))
      },
      symmetricKey,
      base64Decode(cipheredAsymmetricKeyPair.publicKey)
    );
  
    return Promise.all([secretKey, publicKey]).then(function (values) {
      return Promise.resolve({
        secretKey: new Uint8Array(values[0]),
        publicKey: new Uint8Array(values[1])
      });
    });
  };

  const encryptKey = (key, secretKey) => {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const cipheredKey = nacl.secretbox(key, nonce, secretKey);

    return {
      cipher: base64Encode(cipheredKey),
      nonce: base64Encode(nonce)
    };
  };

  const decryptKey = (cipher, nonce, secretKey) => {
    return nacl.secretbox.open(base64Decode(cipher), base64Decode(nonce), secretKey);
  };

  const encryptText = (text, secretKey) => {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const cipheredText = nacl.secretbox(utf8Encode(text), nonce, secretKey);

    return {
      cipheredText: base64Encode(cipheredText),
      nonce: base64Encode(nonce)
    };
  };

  const decryptText = (cipheredText, nonce, secretKey) => {
    return utf8Decode(nacl.secretbox.open(base64Decode(cipheredText), base64Decode(nonce), secretKey));
  };

  return {
      deriveSymmetricKey,
      createKeyPair,
      closeKeyPair,
      openKeyPair,
      encryptKey,
      decryptKey,
      encryptText,
      decryptText
  }
};

export default useCrypto;