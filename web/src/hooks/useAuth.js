import ThinbusSrpClient from 'thinbus-srp/client';
import jwtDecode from 'jwt-decode';

import useApi from './useApi';
import useContent from './useContent';
import useCrypto from './useCrypto';

const useAuth = () => {
  const rfc5054 = {
    N_base10: "21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819",
    g_base10: "2", 
    k_base16: "5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300"
  }

  const {
    api
  } = useApi();

  const {
    deriveSymmetricKey,
    createKeyPair,
    closeKeyPair,
    openKeyPair

  } = useCrypto();

  const {
    createContent
  } = useContent();

  const signUp = (data, callback) => {
    const SRP6JavascriptClientSession = ThinbusSrpClient(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);
    const srpClient = new SRP6JavascriptClientSession();

    const salt = srpClient.generateRandomSalt();
    const verifier = srpClient.generateVerifier(salt, data.email, data.password);
    const vaultKeyPair = createKeyPair();

    deriveSymmetricKey(salt, data.email, data.password)
    .then(function (key) {
      return closeKeyPair(vaultKeyPair, key, salt);
    })
    .then(function (cipheredVaultKeyPair) {
      let defaultFeed = createContent(vaultKeyPair.secretKey);

      return api.post('/api/v1/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        salt,
        verifier,
        cipheredSecretKey: cipheredVaultKeyPair.secretKey,
        cipheredPublicKey: cipheredVaultKeyPair.publicKey,
        defaultFeed: defaultFeed
      });
    })
    .then(function (response) {
      callback(undefined, response.data, {
        secretKey: vaultKeyPair.secretKey,
        publicKey: vaultKeyPair.publicKey
      });
    })
    .catch(function (error) {
      callback(error);
    });
  };

  const signIn = (data, callback) => {
    let salt;
    let token;

    api.post('/api/v1/signin/challenge', {
      email: data.email
    })
    .then(function (response) {
      const SRP6JavascriptClientSession = ThinbusSrpClient(rfc5054.N_base10, rfc5054.g_base10, rfc5054.k_base16);
      const srpClient = new SRP6JavascriptClientSession();

      salt = response.data.salt;

      srpClient.step1(data.email, data.password);
      const step2 = srpClient.step2(salt, response.data.B);

      return api.post('/api/v1/signin/authenticate', {
        email: data.email,
        A: step2.A,
        M1: step2.M1
      });
    })
    .then(function (response) {
      token = response.data;

      return deriveSymmetricKey(salt, data.email, data.password);
    })
    .then(function (symmetricKey) {
      return openKeyPair({
        secretKey: jwtDecode(token).cipheredSecretKey,
        publicKey: jwtDecode(token).cipheredPublicKey
      }, symmetricKey, salt);
    })
    .then(function (vaultKeyPair) {
      callback(undefined, token, vaultKeyPair);
    })
    .catch(function (error) {
      callback(error);
    });
  };

  return {
    signUp,
    signIn
  }
};

export default useAuth;