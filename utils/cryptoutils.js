const crypto = require('crypto');

class CryptoUtils {
    generateSecureKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    
    generateHmac(key, data) {
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(data);
        return hmac.digest('hex');
    }
  }

  module.exports = CryptoUtils;
