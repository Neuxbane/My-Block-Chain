function createBlock(data, callback) {
	$.ajax({
		type: 'post',
		url: "/block-chain/create",
		data : data,
		success: (res) => {
			callback(res);
		},
		error: (err) => {
			console.log(err);
		}
	});
}

function getBlockChain(callback) {
	$.ajax({
		type: 'get',
		url: "/block-chain/get",
		success: (res) => {
			callback(res);
		},
		error: (err) => {
			console.log(err);
		}
	});
}