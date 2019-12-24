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
    return this.height;
  }

  _addToChain(block) {
    block.hash = block.calcHash();
    this.chain.push(block);
  }

  _isGenesisBlock() {
    return this.height === 0 && this.chain.length === 0;
  }

  _getTimestamp() {
    return Date.now().toString();
  }

  _isUnder5mins(message) {
    const delim = ':';
    const currTime = parseInt(this._getTimestamp());
    const mssgTime = parseInt(message.split(delim)[1]);
    const fiveMinsInMiliSeconds = 5 * 60000;
    return (currTime - mssgTime) < fiveMinsInMiliSeconds;
  }

  async getChainHeight() {
    return this.height;
  }

  async _addBlock(block) {
    try {
      this._heightCounter();
      block.setHeight(this.height);
      block.setTime(this._getTimestamp());
      if (!this._isGenesisBlock()) {
        const previousBlock = await this.getBlockByHeight(block.height - 1);
        block.previousBlockHash = previousBlock.hash;
      }
      this._addToChain(block);
      return block;
    } catch (error) {
      throw error;
    }
  }

  async requestMessageOwnershipVerification(address) {
    try {
      const unixTime = this._getTimestamp();
      const messageToSign = `${address}:${unixTime}:starRegistry`;
      return messageToSign;
    } catch (error) {
      throw error;
    }
  }

  async submitStar(address, message, signature, star) {
    try {
      if (this._isUnder5mins(message)) {
        const isValid = bitcoinMessage.verify(message, address, signature);
        if (isValid) {
          const data = {star, address};
          const newBlock = new BlockMod.Block(data);
          await this._addBlock(newBlock);
          return newBlock;
        } else {
          throw new Error('Transaction is not valid!');
        }
      } else {
        throw new Error('Time between message and submission has to be less than 5 minutes!');
      }
    } catch (error) {
      throw error;
    }
  }

  async getBlockByHash(hash) {
    try {
      const block = this.chain.filter((block) => block.hash === hash);
      if (block.length > 0) return block[0];
      throw new Error('Block not found!');
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
        if (bData && bData.address === address) {
          stars.push({star: bData.star, owner: bData.address});
        }
      };
      return stars;
    } catch (error) {
      throw error;
    };
  };

  async validateChain() {
    const errorLog = [];
    try {
      for (let b = 0; b < this.chain.length; b += 1) {
        const currBlock = this.chain[b];
        const isValid = await currBlock.validate();
        if (!isValid) {
          const error1 = {error: 'Block is invalid', block: currBlock};
          errorLog.push(error1);
        }
        if (b > 0) {
          const prevBlock = this.chain[b - 1];
          const auxHash = prevBlock.hash;
          prevBlock.hash = null;
          const validHash = prevBlock.calcHash();
          const hasValidHash = validHash === currBlock.previousBlockHash;
          if (!hasValidHash) {
            const error2 = {error: 'Discrepancy between Blocks', current: currBlock, previous: prevBlock};
            errorLog.push(error2);
          };
          prevBlock.hash = auxHash;
        };
      };
    } catch (error) {
      throw error;
    } finally {
      return errorLog;
    }
  };
}

module.exports.Blockchain = Blockchain;
