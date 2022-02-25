const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");

const decrypt = (value, key, iv) => {
  decryptedTest = AES.decrypt(value, CryptoJS.enc.Utf8.parse(key), { iv: CryptoJS.enc.Utf8.parse(iv) });
  return decryptedTest.toString(CryptoJS.enc.Utf8);
};

const decryptPassword = (encryptedPassword, iv) => {
  const key = process.env.KEY;
  const decrypted = decrypt(
    encryptedPassword,
    key,
    iv
  );
  return decrypted;
}

module.exports.decryptPassword = decryptPassword;
