const crypto = require("crypto");
const fs = require('fs');

const ipfsCrypto = {};
const enteredKey = process.argv[3] || 'super secret passphrase';
const file = process.argv[2];
console.log('entered key: ' + enteredKey);

/** takes in file and optional encoding, returns promise with read data */
function readFilePromise(file, encoding = 'utf-8') {
  return new Promise((resolve, reject) => {
    console.log('inside readFilePromise, file:', file)
    fs.readFile(file, encoding, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data);
      }
    });
  });
}
/** accepts file and runs synchronously  */
function readFileSync(file, encoding = 'utf-8') {
  return fs.readFileSync(file, encoding);
}


/** accepts data and optional algorithm (ex: 'aes-256-cbc')
 *returns encrpted data
 */
function encrypt(data, alg = 'aes-256-cbc', key = enteredKey) {
  console.log('arguments passed to encrypt func: ', data, alg, key);
  let cipher = crypto.createCipher(alg, key);
  let encyptedData = cipher.update(data, 'utf8', 'base64');
  encyptedData += cipher.final('base64');
  console.log(encyptedData);
  return encyptedData
}

/** accepts data and optional algorithm (ex: 'aes-256-cbc')
 *returns promise with encrpted data
 */
function encryptPromise(data, alg = 'aes-256-cbc', key = enteredKey) {
  return new Promise((resolve, reject) => {
    console.log('inside encryptPromise, data:', data)
    let cipher = crypto.createCipher(alg, key);
    let encyptedData = cipher.update(data, 'utf8', 'base64');
    encyptedData += cipher.final('base64');
    resolve(encyptedData)
  })
}


function decrypt(data, alg = 'aes-256-cbc', key = enteredKey) {
  let decipher = crypto.createDecipher('aes-256-cbc', key);
  let decyptedData = decipher.update(data, 'base64', 'utf8')
  decyptedData += decipher.final('utf8');
  console.log(decyptedData);
  return decyptedData;
}
function decryptPromise(data, alg = 'aes-256-cbc', key = enteredKey) {
  return new Promise((resolve) => {
    console.log('inside decryptPromise, data:', data)
    let decipher = crypto.createDecipher('aes-256-cbc', key);
    let decyptedData = decipher.update(data, 'base64', 'utf8')
    decyptedData += decipher.final('utf8');
    console.log(decyptedData);
    resolve(decyptedData);
  })
}
// console.log(process.argv);
// console.log('file var before reading: ' + file);
// let fileData = readFile(file);
// console.log("file data: " + fileData);
// let hidden = encrypt(fileData)
// console.log('hidden var after crypt: ', hidden);
// console.log('decrypted data:\n', decrypt(hidden));
// console.log(decrypt(hidden));

readFilePromise(file).then(encryptPromise).then(decryptPromise).then((data) => console.log('final data: ',  data));




module.exports = ipfsCrypto;



// var crypto, ALGORITHM, KEY, HMAC_ALGORITHM, HMAC_KEY;

// crypto = require('crypto');

// ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
// HMAC_ALGORITHM = 'SHA256';
// KEY = crypto.randomBytes(32); // This key should be stored in an environment variable
// HMAC_KEY = crypto.randomBytes(32); // This key should be stored in an environment variable

// var encrypt = function (plain_text) {

//     var IV = new Buffer(crypto.randomBytes(16)); // ensure that the IV (initialization vector) is random
//     var cipher_text;
//     var hmac;
//     var encryptor;

//     encryptor = crypto.createCipheriv(ALGORITHM, KEY, IV);
//     encryptor.setEncoding('hex');
//     encryptor.write(plain_text);
//     encryptor.end();

//     cipher_text = encryptor.read();

//     hmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
//     hmac.update(cipher_text);
//     hmac.update(IV.toString('hex')); // ensure that both the IV and the cipher-text is protected by the HMAC

//     // The IV isn't a secret so it can be stored along side everything else
//     return cipher_text + "$" + IV.toString('hex') + "$" + hmac.digest('hex') 

// };

// var decrypt = function (cipher_text) {
//     var cipher_blob = cipher_text.split("$");
//     var ct = cipher_blob[0];
//     var IV = new Buffer(cipher_blob[1], 'hex');
//     var hmac = cipher_blob[2];
//     var decryptor;

//     chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
//     chmac.update(ct);
//     chmac.update(IV.toString('hex'));

//     if (!constant_time_compare(chmac.digest('hex'), hmac)) {
//         console.log("Encrypted Blob has been tampered with...");
//         return null;
//     }

//     decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
//     decryptor.update(ct, 'hex', 'utf-8');
//     return decryptedText + decryptor.final('utf-8');


// };