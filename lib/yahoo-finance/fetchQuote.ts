import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"

export async function fetchQuote(ticker: string) {
  const yahooFinance = new YahooFinance();
  noStore()

  try {
    const response = await yahooFinance.quote(ticker)

    return response
  } catch (error) {
    console.log("Failed to fetch stock quote", error)
    throw new Error("Failed to fetch stock quote.")
  }
}
