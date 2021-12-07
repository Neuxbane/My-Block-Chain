const neulock = require('./neulock.js');

// Create a server
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods','GET, POST');
	res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type');
	res.setHeader('Access-Control-Allow-Credentials',true);
	next();
},express.static(__dirname + "/public"));
var port = process.env.PORT || 80;

// Create block chain
let records = new neulock.Blockchain();

// Block chain api call
app.post('/block-chain/create', (req, res, next) => {
    records.isValid();
    records.addBlock(new neulock.Block({ip: req.ip, data:req.body}));
    res.send(records);
});

app.get('/block-chain/get', (req, res, next) => {
    res.send(records);
});

// Start listen on port {port}
app.listen(80, function() {
	console.log("server running");
});