import type { Metadata } from "next"
import { columns } from "@/app/screener/components/columns"
import { DataTable } from "@/app/screener/components/data-table"
import { DEFAULT_SCREENER } from "@/lib/yahoo-finance/constants"
import { fetchScreenerStocks } from "@/lib/yahoo-finance/fetchScreenerStocks"
import { getFavoriteStocks } from "@/lib/stock"
import { ScreenerQuote } from "yahoo-finance2/modules/screener"

export default async function ScreenerPage({
  searchParams,
}: {
  searchParams?: Promise<{
    screener?: string
  }>
}) {
  const params = await searchParams
  const screener = params?.screener || ""

  const screenerDataResults = await fetchScreenerStocks(screener)

  try {
    const favStocks = await getFavoriteStocks()

    favStocks.forEach((item) => {
      const index = screenerDataResults.quotes.findIndex(
        (x) => x.symbol === item.symbol
      )
      if (index !== -1) {
        screenerDataResults.quotes[index].isFav = true
      }
    })
  } catch (error) {}

  return (
    <div>
      <DataTable
        columns={columns}
        data={screenerDataResults.quotes as ScreenerQuote[]}
      />
    </div>
  )
}
