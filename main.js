//My Secure Hash Algorithm
class mySHA {
	#value;
	constructor(value=''){
		this.#value = JSON.stringify(value);
		this.Hash = "0x";
		var length = this.#value.length;
		for (var i = 0; i < length; i++){
			let str = this.#value.charCodeAt(i).toString(36); let res = '';
			for(let x = 0; x < (4-str.length); x++){
				res+='0';
			}
			res += this.#value.charCodeAt(i).toString(36);
			this.Hash += res;
		}
		this.Hash = this.#en(this.Hash);
	}
	#en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")} // Copy-Paste from Internet
	#de(b){let f,o;let a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")} // Copy-Paste from Internet
	getData() {
		let number = this.Hash;
		let string = ""; number = this.#de(number);
		number = number.slice(2);
		let length = number.length;
		for (let i = 0; i < length;) {
			let code = number.slice(i, i += 4);
			string += String.fromCharCode(parseInt(code, 36));
		}
		return string;
	}
}



// The Block
class Block {
	constructor(data = {x: 10}, previousHash = '', timestamp = new Date().getTime()){
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.SHA = new mySHA({timestamp: this.timestamp, data: this.data, previousHash: this.previousHash});
	}

	calculate(){
		this.SHA = new mySHA({timestamp: this.timestamp, data: this.data, previousHash: this.previousHash});
		let data = JSON.parse(this.SHA.getData());
		this.data = data.data;
		this.previousHash = data.previousHash;
		this.timestamp = data.timestamp;
	}
}


// The block chain
class Blockchain {
	#recoverHash;
	constructor(){
		this.chain = [this.#createGenesisBlock()];
		this.#recoverHash = [];
		this.#createBackGuardBlock();
		this.security = 6; // % Scan data
		this.maxScan = 200; // Max scan {number} letter(s)
	}

	recover(){
		this.chain = [this.#createGenesisBlock()];
		this.#createBackGuardBlock();
		for(let recoverBlock = 0; recoverBlock < this.#recoverHash.length-1; recoverBlock++){
			let newSHA = new mySHA();
			newSHA.Hash = this.#recoverHash[recoverBlock];
			let data = JSON.parse(newSHA.getData());
			let newBlock = new Block(data.data);
			newBlock.timestamp = data.timestamp;
			newBlock.calculate();
			this.addBlock(newBlock, true);
		}
		console.log(this.#recoverHash);
	}

	#createGenesisBlock(){
		return new Block("Gensis block");
	}

	#createBackGuardBlock(){
		let guardBlock = new Block("Guard block")
		let prevHash = ''; let hash = this.chain[this.chain.length-1].SHA.Hash;
		let scan = hash.length*(this.security/100);
		if (scan > this.maxScan) scan = this.maxScan;
		for(let previous = 0; previous < scan; previous++){
			prevHash += hash[Math.round(hash.length*(previous/scan))];
		}
		guardBlock.previousHash = prevHash;
		guardBlock.calculate();
		this.chain.push(guardBlock);
	}

	addBlock(newBlock = new Block(), recover = false){
		this.chain.splice(this.chain.length-1,1);
		let prevHash = ''; let hash = this.chain[this.chain.length-1].SHA.Hash;
		let scan = hash.length*(this.security/100);
		if (scan > this.maxScan) scan = this.maxScan;
		for(let previous = 0; previous < scan; previous++){
			prevHash += hash[Math.round(hash.length*(previous/scan))];
		}
		newBlock.previousHash = prevHash;
		newBlock.calculate();
		if (!recover) this.#recoverHash.push(newBlock.SHA.Hash);
		this.chain.push(newBlock);
		this.#createBackGuardBlock();
	}

	isValid(){
		for(let eachBlock = 1; eachBlock < this.chain.length-1; eachBlock++){
			this.chain[eachBlock].calculate();
			let hash = ''; let blockHash = this.chain[eachBlock].SHA.Hash;
			let scan = blockHash.length*(this.security/100);
			if (scan > this.maxScan) scan = this.maxScan;
			for(let readHash = 0; readHash < scan; readHash++){
				hash += blockHash[Math.round(blockHash.length*(readHash/scan))];
			}
			if (hash != this.chain[eachBlock+1].previousHash){
				let errorAt = ''; let broken = 0;
				for(let errorScan = 0; errorScan < hash.length; errorScan++){
					if (hash[errorScan]==this.chain[eachBlock+1].previousHash[errorScan]){
						errorAt += "0"; // Where the letter is same/valid
					} else {
						errorAt += "1"; // Where the letter is diffrent/invalid
						broken++;
					}
				}
				broken = broken/hash.length*100;
				let validHash = this.chain[eachBlock+1].previousHash;
				let thisBlock = this.chain[eachBlock];
				this.recover();
				return {status: false, block: thisBlock, scanHash: hash, validHash: validHash, errorAt: errorAt, brokenPercentage: broken+"%"};
			}
		}
		return {status: true};
	}

	save(){
		return JSON.stringify(this.#recoverHash);
	}

	load(data){
		this.#recoverHash = JSON.parse(data);
		this.recover();
	}
}


// Create a new block chain
let cryptoCoin = new Blockchain();
cryptoCoin.security = 50;

// Add block
cryptoCoin.addBlock(new Block({user: "banu", money: 1_000_000_000}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "ella", money: 4_000_00}));
cryptoCoin.addBlock(new Block({user: "mell", money: 175_000_000}));
cryptoCoin.addBlock(new Block({user: "edo", money: 350_000}));

//Test
console.log(cryptoCoin.isValid());

// Hack test
let chainAt = 1;
let chainData = {user: "banu", money: 9990};

cryptoCoin.chain[chainAt].data=chainData;
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
cryptoCoin = new Blockchain();
cryptoCoin.load(a);



// Check memory usage
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
