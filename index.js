const crypto = require("crypto");
const fs = require('fs');
const child_process = require('child_process')
const exec = child_process.exec
const spawn = child_process.spawn
const path = require('path');
const request = require('request');
const qr = require('qr-image');
const tinyUrl = require('tinyurl');
const nodeCam = require("node-webcam");



const enteredKey = process.argv[3] || 'super secret passphrase';
const file = process.argv[2];
const writePath = process.argv[4] || './deafaultWrite'
const qrWritePath = process.argv[5] || './qr'
const ipfsCrypto = {};
console.log('entered key: ' + enteredKey);

/** accepts file and runs synchronously  */
function readFile(file, encoding = 'utf-8') {
  return fs.readFileSync(file, encoding);
}

/** takes in file and optional encoding, returns promise with read data */
function readFilePromise(file, encoding = 'utf-8') {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        //how do we want this data to be passed
        // if (typeof data === 'string') data = JSON.parse(data);
        // if (typeof data !== 'string') data = JSON.stringify(data);
        resolve(data);
      }
    });
  });
}


/** accepts data and optional algorithm (ex: 'aes-256-cbc')
 *returns encrpted data
 */
function encrypt(data, key = enteredKey, alg = 'aes-256-cbc') {
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
function encryptPromise(data, key = enteredKey, alg = 'aes-256-cbc') {
  return new Promise((resolve, reject) => {
    // console.log('inside encryptPromise, data:', data)
    if (typeof data !== 'string') data = JSON.stringify(data);
    let cipher = crypto.createCipher(alg, key);
    let encyptedData = cipher.update(data, 'utf8', 'base64');
    encyptedData += cipher.final('base64');
    resolve(encyptedData)
  })
}


function decrypt(data, key = enteredKey, alg = 'aes-256-cbc') {
  let decipher = crypto.createDecipher('aes-256-cbc', key);
  let decyptedData = decipher.update(data, 'base64', 'utf8')
  decyptedData += decipher.final('utf8');
  // console.log(decyptedData);
  return decyptedData;
}

function decryptPromise(data, key = enteredKey, alg = 'aes-256-cbc') {
  return new Promise((resolve) => {
    // console.log('inside decryptPromise, data:', data)
    let decipher = crypto.createDecipher('aes-256-cbc', key);
    let decyptedData = decipher.update(data, 'base64', 'utf8')
    decyptedData += decipher.final('utf8');
    // console.log(decyptedData);
    resolve(decyptedData);
  })
}

function writeFile(data, path = writePath) {
  if (typeof data !== 'string') data = JSON.stringify(data)
  fs.writeFileSync(path, data);
  return path;
}

function writeFilePromise(data, path = writePath) {
  if (typeof data !== 'string') data = JSON.stringify(data)
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err)
      resolve(path);
    });
  });
}

function readEncryptedFile(file, key = enteredKey, alg = 'aes-256-cbc') {

}

function readEncryptedFilePromise() {

}

ipfsCrypto.makeHashObj = function(hashStr) {
  var hashArray = hashStr.split(' ');
  var hashObj = {
    [hashArray[1]]: {
      "file": hashArray.slice(2).join(' ').trim(),
      "time": new Date().toUTCString(),
      "url": "https://ipfs.io/ipfs/" + hashArray[1]
    }
  }
  return hashObj;
}

function makeHashObjPromise(hashStr) {
  return new Promise((resolve, reject) => {
    let hashArray = hString.split(' ');
    let hashObj = {
      [hashArray[1]]: {
        "file": hashArray.slice(2).join(' ').trim(),
        "time": new Date().toUTCString(),
        "url": "https://ipfs.io/ipfs/" + hashArray[1]
      }
    }
    resolve(hashObj);
  })
}

function requestHashFromHashObj(hashObj) {
  let url = hashObj["url"]
  requestUrl(url);
}

//not finished
function requestHashFromHashObjPromise(hashObj) {
  let url = hashObj["url"]
  if (!hashObj["url"]) {
    Object.keys(hashObj).forEach((hash) => {
      url = makeUrlFromHash(hash)
    })
  }
  return requestUrlPromise(url);
}

function makeUrlFromHash(hash) {
  //uncomment, mock for now
  return `https://ipfs.io/ipfs/${hash}`;
  // return `http://localhost:3000?hash=${hash}`;
}

function makeUrlFromHashPromise(hash) {
  return new Promise((resolve, reject) => {
    // resolve(`http://localhost:3000?hash=${hash}`);
    resolve(`https://ipfs.io/ipfs/${hash}`);
  });
}

function makeUrlArrayFromHashArray(hashArr) {
  const urlArr = [];
  hashArr.forEach((hash) => urlArr.push(makeUrlFromHash(hash)));
  return urlArr;
}

function makeUrlArrayFromHashArrayPromise(hashArr) {
  const promiseArr = [];
  hashArr.forEach((hash) => promiseArr.push(makeUrlFromHashPromise(hash)));
  return Promise.all(promiseArr);

}

function requestUrlArray(urlArr) {
  urlArr.forEach(requestUrl);
}

function requestUrlArrayPromise(urlArr) {
  const promiseArr = [];
  urlArr.forEach((url) => { promiseArr.push(requestUrlPromise(url)) })
  return Promise.all(promiseArr);
}

function requestUrl(url) {
  for (let i = 0; i < 5; i++) {
    request(url, (err, response, body) => {
      if (err) console.error(err);
    })
  }
}
function requestUrlPromise(url) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < 5; i++) {
      request(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          if (i === 4) resolve(url);
        }
      })
    }
  });
}

function makeHashesObjUrlArray(hashesObj) {
  const urlArr = [];
  for (let hash in hashesObj) {
    urlArr.push(hashesObj[hash].url);
  }
  return urlArr;
}

function makeHashFromUrl(url) {
  return url.replace('https://ipfs.io/ipfs/', '');
}

function makeHashFromUrlPromise(url) {
  return new Promise((resolve, reject) => {
    resolve(url.replace('https://ipfs.io/ipfs/', ''));
  });
}

function makeQr(hash, outputPath = qrWritePath) {
  let output = fs.createWriteStream(outputPath);
  let code = qr.image(hash);
  code.pipe(output);
  output.on('end', () => {
    console.log(outputPath)
  });
}

function makeQrPromise(hash, outputPath = qrWritePath) {
  return new Promise((resolve, reject) => {
    let output = fs.createWriteStream(outputPath);
    let code = qr.image(hash);
    code.pipe(output);
    output.on('end', () => {
      resolve(outputPath)
    });
  })

}

ipfsCrypto.ipfsAdd = function(file) {
  exec(`ipfs add '${file}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    } else {
      let hashObj = makeHashObj(stdout);
      return hashObj;
    }
  });
}

ipfsCrypto.ipfsAddPromise =  function(file) {
  return new Promise((resolve, reject) => {
    exec(`ipfs add '${file}'`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`error in ipfsAddPromise: ${error}`));
      } else {
        let hashObj = ipfsCrypto.makeHashObj(stdout);
        resolve(hashObj);
      }
    });
  })
}

function readHashQrFile() {

}

function readHashQrFilePromise() {

}
/** takes in hash and optional writepath, returns promise which resolves writepath */
function downloadHash(hash, path = writePath) {
  let url = /https:\/\/ipfs.io\/ipfs/.test(hash) ? hash : `https://ipfs.io/ipfs/${hash}`;
  let writeStream = fs.createWriteStream(path);
  request(url).pipe(writeStream);
}
function downloadHashPromise(hash, path = writePath) {
  return new Promise((resolve, reject) => {
    let url = /https:\/\/ipfs.io\/ipfs/.test(hash) ? hash : `https://ipfs.io/ipfs/${hash}`;
    request(url, (err, res, body) => {
      res.pipe(path);
      res.on('finish', () => {
        console.log('download complete');
        resolve(path);
      });
    })
  })
}

/** takes in url or hash, returns promise which resovles minified url */
ipfsCrypto.makeTinyUrlPromise = function(url) {
  return new Promise((resolve, reject) => {
    if (!/Qm/.test(url)) reject(new Error('invalid hash'));
    if (!/https:\/\/ipfs.io\/ipfs\//.test(url)) url = `https://ipfs.io/ipfs/${url}`;
    tinyUrl.shorten(url, function (res) {
      resolve(res); //Returns a shorter version of http://google.com - http://tinyurl.com/2tx
    });
  });
}

//here are the combined chain functions

/**takes in a file path, encypts file and adds encrypted file to ipfs, requests file 5 times, then converts hash to qr code and saves to qrwritepath
 */
function makeQrFromHashes(filePath, qrpath = qrWritePath) {
  readFilePromise(filePath)
    .then(encryptPromise)
    .then(writeFilePromise)
    .then(ipfsAddPromise)
    .then(requestHashFromHashObjPromise)
    .then(makeHashFromUrlPromise)
    .then(makeQrPromise.bind(null, null, qrpath))
    .then(console.log)
    .catch(console.error);
}
// makeQrFromHashes('data.json');


//testing webcam
// const opts = {
//   width: 1280,
//   height: 720,
//   delay: 0,
//   quality: 100,
//   output: "jpeg",
//   verbose: true
// }

// const Webcam = nodeCam.create(opts);
// setTimeout(() => {
//   Webcam.capture("test_picture");
// }, 5000);
var imagesnap = require('imagesnap');
// var fs = require('fs');
// var imageStream = fs.createWriteStream('capture.jpg');
// imagesnap().pipe(imageStream);
console.log(imagesnap);


//testing 
// let data = readFile('data.json');
// console.log('data type is : ', typeof data);
// data = JSON.parse(data);
// console.log('data type is : ', typeof data);


/** example: all the promise functions are chainable */
// readFilePromise('data.json').then(encryptPromise).then(writeFilePromise).then(readFilePromise).then(decryptPromise).then((data) => {
//   console.log(data);
//   console.log(typeof data);
//   console.log(JSON.parse(data))
// }).catch((err) => console.log(err));

// fs.writeFile('tester', JSON.stringify(data));
// readFilePromise('encTestData').then();

// readFilePromise('encTestData').then(requestUrlArrayPromise(data.map(makeUrlFromHash));



// console.log(process.argv);
// console.log('file var before reading: ' + file);
// let fileData = readFile(file);
// console.log("file data: " + fileData);
// let hidden = encrypt(fileData)
// console.log('hidden var after crypt: ', hidden);
// console.log('decrypted data:\n', decrypt(hidden));
// console.log(decrypt(hidden));

// readFilePromise(file).then(encryptPromise).then(decryptPromise).then((data) => console.log('final data: ', data));

// const testHash = 'QmU8PHiXW7rFeVWTYtX7i2VLSi3Fgfxauzn9zisVyfooQA';

// makeUrlFromHashPromise(testHash)
//   .then((passed) => {
//     console.log('passed from UrlHashPromis: ', passed)
//     return requestUrlPromise(passed);
//   })
//   .then((passed) => {
//     // console.log(passed);
//     // return writeFilePromise(passed);
//     makeQr(testHash);

//   })
//   .catch((err) => {
//     console.log('error in catch:', err)
//   });

//testing tinyURl
// const testUrl = 'https://ipfs.io/ipfs/U8PHiXW7rFeVWTYtX7i2VLSi3Fgfxauzn9zisVyfooQA';

// makeTinyUrlPromise(testUrl).then((data) => console.log(data)).catch(err => console.log(err));

// testing hashDownload
// let testUrl = 'https://ipfs.io/ipfs/QmbyNmx4uWiSjf3oPUXJLBJzRroMeTqgsPopkWLpf9j33C'
// downloadHash(testUrl);





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