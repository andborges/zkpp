import jwtDecode from 'jwt-decode';
import { encode as base64Encode, decode as base64Decode } from '@stablelib/base64';

const useToken = () => {
  const TOKEN_KEY = "@zyou-token";
  const VAULT_S_KEY = "@zyou-s-vault";
  const VAULT_P_KEY = "@zyou-p-vault";

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const isAuthenticated = () => {
    if (!localStorage.getItem(TOKEN_KEY) || !localStorage.getItem(VAULT_S_KEY) || !localStorage.getItem(VAULT_P_KEY)) {
      logout();
      return false;
    }

    return true;
  };

  const getId = () => {
    if (!getToken()) return undefined;
  
    let decoded = jwtDecode(getToken());
  
    return decoded.id;
  };
  
  const getFirstName = () => {
    if (!getToken()) return undefined;
  
    let decoded = jwtDecode(getToken());
  
    return decoded.firstName;
  };

  const getName = () => {
    if (!getToken()) return undefined;
  
    let decoded = jwtDecode(getToken());
  
    return decoded.firstName + ' ' + decoded.lastName;
  };
  
  const getEmail = () => {
    if (!getToken()) return undefined;
  
    let decoded = jwtDecode(getToken());
  
    return decoded.email;
  };
  
  const getDefaultContentId = () => {
    if (!getToken()) return undefined;
  
    let decoded = jwtDecode(getToken());
  
    return decoded.defaultContentId;
  };
  
  const getVault = () => {
    if (!getToken()) return undefined;
  
    let decoded = jwtDecode(getToken());
  
    return decoded.vault;
  };

  const getVaultSecretKey = () => {
    const vaultKey = localStorage.getItem(VAULT_S_KEY);

    if (!vaultKey) return undefined;
  
    let decoded = base64Decode(vaultKey);

    return decoded;
  };

  const getVaultPublicKey = () => {
    const vaultKey = localStorage.getItem(VAULT_P_KEY);

    if (!vaultKey) return undefined;
  
    let decoded = base64Decode(vaultKey);

    return decoded;
  };
  
  const login = (token, vaultKeyPair) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(VAULT_S_KEY, base64Encode(vaultKeyPair.secretKey));
    localStorage.setItem(VAULT_P_KEY, base64Encode(vaultKeyPair.publicKey));
  };
  
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(VAULT_S_KEY);
    localStorage.removeItem(VAULT_P_KEY);
  };

  return {
    getToken,
    isAuthenticated,
    getId,
    getFirstName,
    getName,
    getEmail,
    getDefaultContentId,
    getVault,
    getVaultSecretKey,
    getVaultPublicKey,
    login,
    logout
  }
};

export default useToken;