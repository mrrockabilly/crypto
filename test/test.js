var assert = require('assert');
var library = require('../index.js');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should;
//chai.should();



describe('makeHashObj', function () {
  describe('when passed output from IPFS add', function () {
    let sampleString = "added QmdjC7zjKi7pYoo3YatWL6pNvJqDxAZJhXBBeXzXhzhEwp pedal.png";
    let hash = 'QmdjC7zjKi7pYoo3YatWL6pNvJqDxAZJhXBBeXzXhzhEwp';
    let result = library.makeHashObj(sampleString);
    let expectedUrl = 'https://ipfs.io/ipfs/QmdjC7zjKi7pYoo3YatWL6pNvJqDxAZJhXBBeXzXhzhEwp'
    it('should return valid file name', function () {
      assert.equal(result[hash].file, 'pedal.png');
    });
    it('should return timestamp', function () {
      assert.equal(result[hash].time.length, 29);
    });
    it('should return valid url', function () {
      assert.equal(result[hash].url, expectedUrl);
    });
  });
});

describe('ipfsAddPromise', function () {
  this.timeout(15000);
  let petalHash = 'QmdjC7zjKi7pYoo3YatWL6pNvJqDxAZJhXBBeXzXhzhEwp';
  it('should return a correct file name', function (done) {
    library.ipfsAddPromise("/Users/JasonRay/Desktop/pedal.png").then(function (data) {
      expect(data[petalHash].file).to.equal('pedal.png');
      done();
    }).catch(function (error) {
      done(error);
    });
  });
});

describe('makeTinyUrlPromise', function () {
  this.timeout(15000);
  let sampleUrl = 'https://ipfs.io/ipfs/QmaC8Mu1ycE2NhfHSarDoW7CXCrdcKnDiDLsiumk79XLrz';
  it('should return a tiny url', function (done) {
    library.makeTinyUrlPromise(sampleUrl).then(function (data) {
      expect(data.substring(0, 18)).to.equal('http://tinyurl.com');
      done();
    }).catch(function (error) {
      done(error);
    });
  });
});

// describe('downloadHashPromise', function () {
//   let sampleHash = 'QmaC8Mu1ycE2NhfHSarDoW7CXCrdcKnDiDLsiumk79XLrz';
//   let samplePath = '/Users/JasonRay/Desktop/'
//   it('should save to the desktop', function (done) {
//     library.downloadHashPromise(sampleHash, samplePath).then(function (data) {
//       expect(1).to.equal(1);
//       done();
//     }).catch(function (error) {
//       done(error);
//     });
//   });
// });


// function downloadHashPromise(hash, path = writePath) {
//   return new Promise((resolve, reject) => {
//     let url = /https:\/\/ipfs.io\/ipfs/.test(hash) ? hash : `https://ipfs.io/ipfs/${hash}`;
//     request(url, (err, res, body) => {
//       res.pipe(path);
//       res.on('finish', () => {
//         console.log('download complete');
//         resolve(path);
//       });
//     })
//   })
// }





// function downloadHashPromise(hash, path = writePath) {
//   return new Promise((resolve, reject) => {
//     let url = /https:\/\/ipfs.io\/ipfs/.test(hash) ? hash : `https://ipfs.io/ipfs/${hash}`;
//     request(url, (err, res, body) => {
//       res.pipe(path);
//       res.on('finish', () => {
//         console.log('download complete');
//         resolve(path);
//       });
//     })
//   })
// }
