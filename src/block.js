const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
  constructor(data) {
    this.hash = null;
    this.height = 0;
    this.body = this.getBuffer(data);
    this.time = 0;
    this.previousBlockHash = null;
  };
  getBuffer(data) {
    const jsonStr = JSON.stringify(data);
    const buffer = Buffer.from(jsonStr).toString('hex');
    return buffer;
  };

  async validate() {
    const auxHash = this.hash;
    try {
      this.hash = null;
      const blockData = await JSON.stringify(this);
      const calcHash = await SHA256(blockData).toString();
      if (auxHash === calcHash) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.hash = auxHash;
    }
  }
}

module.exports.Block = Block;
