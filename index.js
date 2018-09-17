#!/usr/bin/env node
var logger = require('loglevel');
logger.setLevel("info");
var server = require('./app');

server.listen(process.env.PORT || 3005, function() {
    logger.info('Express server listening on port 3005');
});
