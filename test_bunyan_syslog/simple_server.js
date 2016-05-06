'use strict';

var net = require('net');

net.createServer(function (c) {
 c.on('data', function (data) {
 	console.log(data.toString());
 });
 c.pipe(c);
}).listen(81);