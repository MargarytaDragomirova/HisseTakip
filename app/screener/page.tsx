import type { Metadata } from "next"
import { columns } from "@/app/screener/components/columns"
import { DataTable } from "@/app/screener/components/data-table"
import { DEFAULT_SCREENER } from "@/lib/yahoo-finance/constants"
import { fetchScreenerStocks } from "@/lib/yahoo-finance/fetchScreenerStocks"
import { getFavoriteStocks } from "@/lib/stock"

export const metadata: Metadata = {
  title: "Finly: Stock screener",
  description: "Find the best stocks to buy now with the Finly stock screener.",
}
export default async function ScreenerPage({
  searchParams,
}: {
  searchParams?: {
    screener?: string
  }
}) {
  const screener = searchParams?.screener || ""

  const screenerDataResults = await fetchScreenerStocks(screener)
  const favStocks = await getFavoriteStocks();

  favStocks.map((item) => {
    const index = screenerDataResults.quotes.findIndex((x) => x.symbol == item.symbol)
    if (index != -1) {
      screenerDataResults.quotes[index].isFav = true
    }
  })


  return (
    <div>
      <DataTable columns={columns} data={screenerDataResults.quotes} />
    </div>
  )
}
