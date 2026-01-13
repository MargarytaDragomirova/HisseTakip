import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"
import { BIST_STOCKS } from "@/data/bistStocks"

const ITEMS_PER_PAGE = 100

export async function fetchScreenerStocks(_: string, count?: number) {
  const yahooFinance = new YahooFinance();
  noStore()

  try {
    const quotes = await yahooFinance.quote(BIST_STOCKS, {
      region: "TR",
      lang: "tr-TR",
    })

    const limitedQuotes = quotes.slice(0, count ?? ITEMS_PER_PAGE)

    return {
      quotes: limitedQuotes,
      total: BIST_STOCKS.length,
    }
  } catch (error) {
    console.log("Failed to fetch BIST stocks", error)
    throw new Error("Failed to fetch BIST stocks.")
  }
}
