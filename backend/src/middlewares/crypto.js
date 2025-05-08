import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VUE_APP_CRYPTO_SECRET;

export const encryptData = (data) => {
  try {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
