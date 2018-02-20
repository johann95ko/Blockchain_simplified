const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-20-02"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     //newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain [i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                //console.log("in Valid current hash: " + currentBlock.hash );
                //console.log("in Valid current calc hash: " + currentBlock.calculateHash() );
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                //console.log("in Valid current see prev hash: " + currentBlock.previousHash );
                //console.log("in Valid prev hash: " + previousBlock.hash );
                return false;
            }
        }

        return true;
    }
}

let johannCoin = new Blockchain();
johannCoin.createTransaction(new Transaction('address1','address2',100));
johannCoin.createTransaction(new Transaction('address2','address1',50));

/*---------------
    NOTE: Mining reward is saved in transactions and rewarded in next mining. hence, first mine balance is 0
---------------*/

//First Mining attempt
console.log("\nStarting the miner...");
johannCoin.minePendingTransactions('johann-address');

console.log("\nBalance of Johann is ",johannCoin.getBalanceOfAddress('johann-address'));

//Second Mining attempt
console.log("\nStarting the miner again...");
johannCoin.minePendingTransactions('johann-address');

console.log("\nBalance of Johann is ",johannCoin.getBalanceOfAddress('johann-address'));

//Third Mining Attempt
console.log("\nStarting the miner third time...");
johannCoin.minePendingTransactions('johann-address');

console.log("\nBalance of Johann is ",johannCoin.getBalanceOfAddress('johann-address'));


/*----------------------------------------------
Additional code for personal loggings
-----------------------------------------------*/
/*console.log("mining block 1...");
johannCoin.addBlock(new Block(1, "17/02/2018", { amount: 4}));
console.log("mining block 2...");
johannCoin.addBlock(new Block(2, "19/02/2018", { amount: 10}));

console.log('Is Blockchain valid: ' + johannCoin.isChainValid());*/
/////////////////////////////////////////////
/*johannCoin.chain[1].data = { amount: 100};

for (let j =1; j < johannCoin.chain.length; j++){
    currentBlock = johannCoin.chain[j];
    if ( j+1 < johannCoin.chain.length){
    nextBlock = johannCoin.chain[j+1];}
    console.log("before: " + currentBlock.hash);
    currentBlock.hash = currentBlock.calculateHash();
    nextBlock.previousHash = currentBlock.hash;
    console.log("after: " + currentBlock.hash);
}*/
//console.log('2) Is Blockchain valid: ' + johannCoin.isChainValid());

//console.log(JSON.stringify(johannCoin, null, 4));