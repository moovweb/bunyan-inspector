'use strict';

const http = require('http');
const bunyan = require('bunyan');
const bsyslog = require('bunyan-syslog');
const vm = require('vm');

var logger = bunyan.createLogger({
    name: 'foo',
    streams: [ {
        level: 'debug',
        type: 'raw',
        stream: bsyslog.createBunyanStream({
            type: 'tcp',
            host: 'localhost',
            port: 81
        })
    }]
});


var sandbox = {
  animal: 'cat',
  count: 2
};

sandbox.console = {
    log: logger.debug.bind(logger)
};

var context = new vm.createContext(sandbox);
var script = new vm.Script('count += 1;  animal += "t"; console.log(count); console.log(animal);');
// var script = new vm.Script('count += 1;  animal += "t"; debugger; console.log(count); console.log(animal);');

http.createServer(function (req, res) {
 for (var i = 0; i < 10; ++i) {
    script.runInContext(context);
 }

 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end('YAY');
}).listen(80);