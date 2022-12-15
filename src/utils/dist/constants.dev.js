"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEXSCREENER_URL = exports.GET_ALL_TOKENS = exports.GRAPHQL_URL = void 0;
var GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";
exports.GRAPHQL_URL = GRAPHQL_URL;

var GET_ALL_TOKENS = function GET_ALL_TOKENS(i) {
  return "{\n    tokens(first: 1000, skip: ".concat(i + 1, ") {\n        id\n        name\n        symbol\n        totalSupply\n        decimals\n        pairBase {\n            id\n        }\n    }\n}");
};

exports.GET_ALL_TOKENS = GET_ALL_TOKENS;

var DEXSCREENER_URL = function DEXSCREENER_URL(pair) {
  return "https://api.dexscreener.com/latest/dex/pairs/ethereum/".concat(pair);
};

exports.DEXSCREENER_URL = DEXSCREENER_URL;