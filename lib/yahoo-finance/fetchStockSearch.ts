import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"
import type { SearchResult } from "yahoo-finance2/modules/search"

export async function fetchStockSearch(ticker: string, newsCount: number = 5) {
  const yahooFinance = new YahooFinance();
  noStore()

  const queryOptions = {
    quotesCount: 1,
    newsCount: newsCount,
    enableFuzzyQuery: true,
  }

  try {
    const response: SearchResult = await yahooFinance.search(
      ticker,
      queryOptions
    )

    return response
  } catch (error) {
    console.log("Failed to fetch stock search", error)
    throw new Error("Failed to fetch stock search.")
  }
}
