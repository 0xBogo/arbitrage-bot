export const GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";

export const GET_ALL_TOKENS = (i) => `{
    tokens(first: 1000, skip: ${i + 1}) {
        id
        name
        symbol
        totalSupply
        decimals
        pairBase {
            id
        }
    }
}`;

export const DEXSCREENER_URL = (pair) => `https://api.dexscreener.com/latest/dex/pairs/ethereum/${pair}`;