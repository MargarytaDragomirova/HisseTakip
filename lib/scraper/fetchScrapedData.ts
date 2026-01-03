import { unstable_noStore as noStore } from "next/cache"

export async function fetchScrapedData(ticker: string) {
  noStore()

  ticker = ticker.substring(0,ticker.length - 3)

  try {
    const url = `http://localhost:3001/scrape?symbol=${ticker}`;
    const response = await fetch(url)

    const data = await response.json();

    return data
  } catch (error) {
    console.log("Failed to fetch stock quote", error)
    throw new Error("Failed to fetch stock quote.")
  }
}
