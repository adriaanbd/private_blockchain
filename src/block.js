const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
  constructor(data) {
    this.hash = null;
    this.height = -1;
    this.body = this.getBuffer(data);
    this.time = 0;
    this.previousBlockHash = null;
  };

  getBuffer(data) {
    const jsonStr = JSON.stringify(data);
    const buffer = Buffer.from(jsonStr).toString('hex');
    return buffer;
  };

  calcHash() {
    const blockData = JSON.stringify(this);
    const calcHash = SHA256(blockData);
    return calcHash.toString();
  };

  setHeight(height) {
    this.height = height;
  }

  setTime(time) {
    this.time = time;
  };

  async validate() {
    const auxHash = this.hash;
    this.hash = null;
    const isValid = auxHash === this.calcHash();
    this.hash = auxHash;
    return isValid;
  };

  async getBData() {
    if (this.previousBlockHash == null) return;
    const asciiBody = hex2ascii(this.body);
    const decodedBody = JSON.parse(asciiBody);
    return decodedBody;
  }
}

module.exports.Block = Block;
