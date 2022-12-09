"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_ALL_TOKENS = exports.GRAPHQL_URL = void 0;
var GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";
exports.GRAPHQL_URL = GRAPHQL_URL;
var GET_ALL_TOKENS = "{\n    tokens(first: 500, skip: 5000) {\n        id\n        name\n        symbol\n        totalSupply\n        totalLiquidity\n        decimals\n        tokenDayData(first: 1) {\n            dailyVolumeUSD\n            priceUSD\n        }\n        pairBase {\n            id\n        }\n    }\n}";
exports.GET_ALL_TOKENS = GET_ALL_TOKENS;