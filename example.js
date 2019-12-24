/*
This script is for ilustration purposes only. It creates a chain, add blocks to it, validates the block and chain, gets a block by height and hash, and interacts with API endpoints.
*/

const block = require('./src/block');
const chain = require('./src/blockchain');
const fetch = require('node-fetch');

const bData = 'HelloWorld';
const cData = 'HelloPanama';
const b = new block.Block(bData);
const c = new block.Block(cData);

const bchain = new chain.Blockchain();

(async () => {
  await bchain._addBlock(b);
  await bchain._addBlock(c);
  b.time = 123456789;
  b.height = 10;
  const logs = await bchain.validateChain();
  console.log(logs.length == 2);

  const blockByHash = await bchain.getBlockByHash(c.hash);
  console.log(blockByHash === c);

  const blockByHeight = await bchain.getBlockByHeight(1);
  console.log(blockByHeight === b);

  const data = await b.getBData();
  console.log(data === bData);

  console.log(await b.validate() === false);
})().catch((e) => console.log(e));

// assuming you have started the app with $ node app.js
(async () => {
  console.log('\nAPI endpoints\n');
  const root = 'http://localhost:8000';
  // replace with your wallet address
  const address = 'mrj72EQNAPgciGw7F1238Q7gEzzX7Dvvvd';
  // replace with your signature after signing it with your address
  /* this is done with: $ bitcoin-cli -testnet signmessage "mrj72EQNAPgciGw7F1238Q7gEzzX7Dvvvd" "mrj72EQNAPgciGw7F1238Q7gEzzX7Dvvvd:1577212307246:starRegistry" */
  const signature = 'INON5sZ1CM5mh+vyOE+jFZwhykgDjvSkhWdUOwlsVAxCGdwdNiR/nd29MFhjD6XOsXXt0zedK5U4BO+y0ZWk6S8=';

  console.log('GET genesis block\n');
  let response = await fetch(`${root}/block/0`);
  const block = await response.json();
  console.log(block);

  console.log('POST request validation\n');
  let options = {
    method: 'POST',
    body: JSON.stringify({'address': address}),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  response = await fetch(
      `${root}/requestValidation`, options);
  let respData = await response.json();
  console.log(respData);

  console.log('\nPOST submit star\n');
  const submission = {
    message: `${address}:1577212307246:starRegistry`,
    address: address,
    signature: signature,
    star: 'ARTEMIS',
  };
  options = {
    method: 'POST',
    body: JSON.stringify(submission),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // submission won't work if 5 mins have passed between signing and submission
  response = await fetch(`${root}/submitStar`, options);
  respData = await response.json();
  console.log(respData);

  console.log('\nGET all stars\n');

  response = await fetch(`${root}/blocks/${address}`);
  respData = await response.json();
  console.log(respData);
})().catch((e) => console.log(e));
