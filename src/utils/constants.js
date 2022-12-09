export const GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";
export const GET_ALL_TOKENS = `{
    tokens(first: 500, skip: 5000) {
        id
        name
        symbol
        totalSupply
        totalLiquidity
        decimals
        tokenDayData(first: 1) {
            dailyVolumeUSD
            priceUSD
        }
        pairBase {
            id
        }
    }
}`;