'use strict'

let config,configDefault;
try{
  config = require(__dirname + '/../etc/config.json');
} catch (e) {
  config = {};
}
configDefault = require(__dirname + '/../etc/config.default.json');

module.exports = Object.assign({},configDefault,config);