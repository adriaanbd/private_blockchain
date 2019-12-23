const SHA256 = require('crypto-js/sha256');
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

  heightCounter() {
    this.height += 1;
    return this.height;
  }

  addToChain(block) {
    this.chain.push(block);
  }

  /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
  async getChainHeight() {
    return this.height;
  }

  async _addBlock(block) {
    (async () => {
      try {
        const height = this.heightCounter();
        block.setHeight(height);
        block.setTime();
        if (!isGenesisBlock(block.height)) {
          const previousBlock = await this.getBlockByHeight(this.height);
          block.previousHash = previousBlock.hash;
        } else {
          block.hash = block.calcHash();
          this.addToChain(block);
          return block;
        }
      } catch (e) {
        throw new Error(e);
      }
    })();
  }

  /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address
     */
  requestMessageOwnershipVerification(address) {
    return new Promise((resolve) => {

    });
  }

  /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address
     * @param {*} message
     * @param {*} signature
     * @param {*} star
     */
  submitStar(address, message, signature, star) {
    const self = this;
    return new Promise(async (resolve, reject) => {

    });
  }

  /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash
     */
  getBlockByHash(hash) {
    const self = this;
    return new Promise((resolve, reject) => {

    });
  }

  /**
     * This method will return a Promise that will resolve with the Block object
     * with the height equal to the parameter `height`
     * @param {*} height
     */
  getBlockByHeight(height) {
    const self = this;
    return new Promise((resolve, reject) => {
      const block = self.chain.filter((p) => p.height === height)[0];
      if (block) {
        resolve(block);
      } else {
        resolve(null);
      }
    });
  }

  /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address
     */
  getStarsByWalletAddress(address) {
    const self = this;
    const stars = [];
    return new Promise((resolve, reject) => {

    });
  }

  /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
  validateChain() {
    const self = this;
    const errorLog = [];
    return new Promise(async (resolve, reject) => {

    });
  }
}

module.exports.Blockchain = Blockchain;
