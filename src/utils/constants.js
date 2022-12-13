export const GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";
export const GET_ALL_TOKENS = `{
    tokens(first: 100, skip: 5000) {
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