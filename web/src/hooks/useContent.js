import uuidv4 from 'uuid/v4';
import _ from 'lodash';

import useCrypto from './useCrypto';
import useToken from './useToken';

const useContent = () => {
  const {
    createKeyPair,
    encryptKey,
    decryptKey,
    encryptText,
    decryptText
  } = useCrypto();

  const {
    getVault,
    getVaultSecretKey
  } = useToken();

  const createContent = (vaultSecretKey) => {
    const contentSecretKey = createKeyPair().secretKey;
    const cipheredContentSecretKey = encryptKey(contentSecretKey, vaultSecretKey);

    return {
      id: uuidv4(),
      secretKey: cipheredContentSecretKey
    }
  };

  const getContentSecretKey = (contentId) => {
    const vault = getVault();
    const cipheredContentSecretKey = _.find(vault, { 'contentId': contentId });
    const vaultSecretKey = getVaultSecretKey();
    const contentSecretKey = decryptKey(cipheredContentSecretKey.secretKey, cipheredContentSecretKey.nonce, vaultSecretKey);
  
    return contentSecretKey;
  };

  const readContent = (contentId, nonce, cipheredContent) => {
    return decryptText(cipheredContent, nonce, getContentSecretKey(contentId));
  };

  const saveContent = (contentId, content) => {
    return encryptText(content, getContentSecretKey(contentId));
  };

  return {
    createContent,
    readContent,
    saveContent
  }
};

export default useContent;