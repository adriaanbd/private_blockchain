const BlockMod = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {
  constructor() {
    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  async initializeChain() {
    if ( this.height === -1) {
      const blockData = {data: 'Genesis Block'};
      const block = new BlockMod.Block(blockData);
      await this._addBlock(block);
    }
  }

  async _heightCounter() {
    this.height += 1;
    const height = await this.getChainHeight();
    return height;
  }

  _addToChain(block) {
    block.hash = block.calcHash();
    this.chain.push(block);
  }

  _isGenesisBlock() {
    return this.height === 0 && this.chain.length === 0;
  }

  _getUnixTime() {
    return new Date().getTime().toString().slice(0, -3);
  }

  _isUnder5mins(message) {
    const delim = ':';
    const currTime = parseInt(this.getUnixTime);
    const mssgTime = parseInt(message.split(delim)[1]);
    const fiveMinsInSeconds = 5 * 60;
    return currTime - mssgTime < fiveMinsInSeconds;
  }

  async getChainHeight() {
    return this.height;
  }

  async _addBlock(block) {
    (async () => {
      try {
        block.setHeight(this._heightCounter());
        block.setTime(this._getUnixTime());
        if (!this._isGenesisBlock()) {
          const previousBlock = await this.getBlockByHeight(block.height);
          block.previousHash = previousBlock.hash;
        }
        this._addToChain(block);
        return block;
      } catch (error) {
        throw error;
      }
    })().catch((e) => console.log(e));
  };

  async requestMessageOwnershipVerification(address) {
    try {
      const unixTime = this.getUnixTime();
      const messageToSign = `${address}:${unixTime}:starRegistry`;
      return messageToSign;
    } catch (error) {
      throw error;
    }
  }

  async submitStar(address, message, signature, star) {
    (async () => {
      try {
        if (this._isUnder5mins(message)) {
          const isValid = bitcoinMessage.verify(message, address, signature);
          if (isValid) {
            const data = {star, address};
            const newBlock = new BlockMod.Block(data);
            return await this._addBlock(newBlock);
          }
        } else {
          throw new Error('Time between message and submission has to be less than 5 minutes!');
        }
      } catch (error) {
        throw error;
      }
    })().catch((e) => console.log(e));
  }

  async getBlockByHash(hash) {
    try {
      const block = this.chain.filter((block) => block.hash === hash);
      return block;
    } catch (error) {
      throw error;
    }
  }

  async getBlockByHeight(height) {
    try {
      const block = this.chain[height];
      if (block) return block;
      return null;
    } catch (error) {
      throw error;
    }
  }

  async getStarsByWalletAddress(address) {
    const stars = [];
    try {
      for (const block of this.chain) {
        const bData = await block.getBData();
        if (bData.address === address) {
          stars.push(bdata.star);
        }
      };
      return stars;
    } catch (error) {
      throw error;
    };
  };

  async validateChain() {
    const errorLog = [];
    (async () => {
      try {
        for (const b = 0; b < this.chain.length; b += 1) {
          const currBlock = this.chain[b];
          const isValid = await currBlock.validate();
          if (!isValid) {
            const error1 = {error: 'Block is invalid', block: currBlock.height};
            errorLog.push(error1);
          }
          if (currBlock.height > 0) {
            const prevBlock = this.chain[b - 1];
            const hasValidHash = prevBlock.calcHash() === currBlock.previousHash;
            if (!hasValidHash) {
              const error2 = {error: 'Discrepancy between Blocks', blocks: [prevBlock, currBlock.height]};
              errorLog.push(error2);
            };
          };
        };
      } catch (error) {
        throw error;
      }
    })().catch((e) => console.log(e));
  };
}

module.exports.Blockchain = Blockchain;
