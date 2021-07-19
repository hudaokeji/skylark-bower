#!/usr/bin/env node

var path = require('path');
var spkgmConfig = require('..');

var config = spkgmConfig.read(path.join(__dirname + '/assets/env-variables'), {
    foo: 'bar'
});

console.log(config);
