export const GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2";
export const GET_ALL_TOKENS = `{
    tokens (first: 1000, skip: 5000) {
        id
        symbol
        name
        decimals
        totalSupply
        tradeVolume
        tradeVolumeUSD
        untrackedVolumeUSD
        totalLiquidity
        tokenDayData {
            priceUSD
            dailyVolumeUSD
        }
    }
}`;
export const GET_TOKEN = (address) => `{
    token(id: "${address}") {
        id
        name
        symbol
        decimals
        totalSupply
        totalLiquidity
        tradeVolume
        tradeVolumeUSD
        untrackedVolumeUSD
        tokenDayData {
            priceUSD
            dailyVolumeUSD
        }
    }
}`;