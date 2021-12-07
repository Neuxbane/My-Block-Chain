const neulock = require('./neulock.js');

// Create a new block chain
let cryptoCoin = new neulock.Blockchain();
cryptoCoin.security = 10;

// Add block
cryptoCoin.addBlock(new neulock.Block({user: "banu", money: 1_000_000_000}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new neulock.Block({user: "mell", money: 175_000_000}));
cryptoCoin.addBlock(new neulock.Block({user: "edo", money: 350_000}));

//Test
console.log(cryptoCoin.isValid());

// Hack test
let chainAt = 1;
let chainData = {user: "banu", money: 2_000_000_000};

// Recalculate Hash for Hacked Block <- This hack doesn't work
cryptoCoin.chain[chainAt].data = chainData;
for(let eachBlock = chainAt; eachBlock < cryptoCoin.chain.length-1; eachBlock++){
	cryptoCoin.chain[chainAt].calculate();
	let prevHash = ''; let hash = cryptoCoin.chain[eachBlock].SHA.Hash;
	let scan = hash.length*(cryptoCoin.security/100);
	if (scan > cryptoCoin.maxScan) scan = cryptoCoin.maxScan;
	for(let previous = 0; previous < scan; previous++){
		prevHash += hash[Math.round(hash.length*(previous/scan))];
	}
	cryptoCoin.chain[eachBlock+1].previousHash=prevHash;
	cryptoCoin.chain[chainAt+1].calculate();
}
cryptoCoin.chain.splice(cryptoCoin.chain.length-1,1);


// Recover Things
console.log(cryptoCoin.isValid()); // Auto recover the data if broken and return something 😏
cryptoCoin.recover() //Just recover the data

// Save block chain data
let a = cryptoCoin.save();

cryptoCoin = undefined;

// Load block chain data
cryptoCoin = new neulock.Blockchain();
cryptoCoin.load(a);



// Check memory usage
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
