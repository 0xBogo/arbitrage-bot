"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_TOKEN = exports.GET_ALL_TOKENS = exports.GRAPHQL_URL = void 0;
var GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";
exports.GRAPHQL_URL = GRAPHQL_URL;
var GET_ALL_TOKENS = "{\n    tokens (first: 50, skip: 5000) {\n        id\n        symbol\n        name\n        decimals\n        totalSupply\n        tradeVolume\n        tradeVolumeUSD\n        untrackedVolumeUSD\n        totalLiquidity\n        tokenDayData {\n            priceUSD\n            dailyVolumeUSD\n        }\n    }\n}";
exports.GET_ALL_TOKENS = GET_ALL_TOKENS;

var GET_TOKEN = function GET_TOKEN(address) {
  return "{\n    token(id: \"".concat(address, "\") {\n        id\n        name\n        symbol\n        decimals\n        totalSupply\n        totalLiquidity\n        tradeVolume\n        tradeVolumeUSD\n        untrackedVolumeUSD\n        tokenDayData {\n            priceUSD\n            dailyVolumeUSD\n        }\n    }\n}");
};

exports.GET_TOKEN = GET_TOKEN;