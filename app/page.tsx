import YahooFinance from "yahoo-finance2";
import { DataTable } from "@/components/stocks/markets/data-table"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/yahoo-finance/constants"
import { Interval } from "@/types/yahoo-finance"
import { Suspense } from "react"
import MarketsChart from "@/components/chart/MarketsChart"
import Link from "next/link"
import { columns } from "@/components/stocks/markets/columns"
import {
  validateInterval,
  validateRange,
} from "@/lib/yahoo-finance/fetchChartData"
import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch"
const tickers = [
  { symbol: "THYAO.IS", shortName: "Türk Hava Yollari Anonim Ortakligi" },
  { symbol: "GARAN.IS", shortName: "Turkiye Garanti Bankasi A.S." },
  {
    symbol: "BASGZ.IS",
    shortName: "Baskent Dogalgaz Dagitim Gayrimenkul Yatirim Ortakligi A.S.",
  },
  { symbol: "TUPRS.IS", shortName: "Türkiye Petrol Rafinerileri A.S." },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
  { symbol: "GC=F", shortName: "Altın" },
  { symbol: "SI=F", shortName: "Gümüş" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  // { symbol: "CL=F", shortName: "Crude Oil" },
  // { symbol: "^TNX", shortName: "10 Year Bond" },
]

function getMarketSentiment(changePercentage: number | undefined) {
  if (!changePercentage) {
    return "neutral"
  }
  if (changePercentage > 0.1) {
    return "bullish"
  } else if (changePercentage < -0.1) {
    return "bearish"
  } else {
    return "neutral"
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    ticker?: string
    range?: string
    interval?: string
  }
}) {
  const yahooFinance = new YahooFinance();
  const ticker = searchParams?.ticker || tickers[0].symbol
  const range = validateRange(searchParams?.range || DEFAULT_RANGE)
  const interval = validateInterval(
    range,
    (searchParams?.interval as Interval) || DEFAULT_INTERVAL
  )
  const news = await fetchStockSearch("GC=F", 2)

  const promises = tickers.map(({ symbol }) =>
    yahooFinance.quoteCombine(symbol)
  )
  const results = await Promise.all(promises)

  const resultsWithTitles = results.map((result: any, index: any) => ({
    ...result,
    shortName: tickers[index].shortName,
  }))

  const marketSentiment = getMarketSentiment(
    resultsWithTitles[0].regularMarketChangePercent
  )

  const sentimentColor =
    marketSentiment === "bullish"
      ? "text-green-500"
      : marketSentiment === "bearish"
        ? "text-red-500"
        : "text-neutral-500"

  const sentimentBackground =
    marketSentiment === "bullish"
      ? "bg-green-500/10"
      : marketSentiment === "bearish"
        ? "bg-red-300/50 dark:bg-red-950/50"
        : "bg-neutral-500/10"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row ">
        <div className="w-full lg:w-1/2">
          <Card className="relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden">
            <CardHeader>
              <CardTitle className="z-50 w-fit rounded-full px-4  py-2 font-medium dark:bg-neutral-100/5">
                The markets are{" "}
                <strong className={sentimentColor}>{marketSentiment}</strong>
              </CardTitle>
            </CardHeader>
            <div
              className={`pointer-events-none absolute inset-0 z-0 h-[65%] w-[65%] -translate-x-[10%] -translate-y-[30%] rounded-full blur-3xl ${sentimentBackground}`}
            />
          </Card>
        </div>
        <div className="w-full lg:w-1/2">
          <Card className="min-h-[15rem]">
            <Suspense fallback={<div>Loading...</div>}>
              <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-500" style={{ padding:"24px" }}>
                What you need to know today
              </p>
              {news.news.map((item: any) => (
                <CardContent>
                  <Link
                    prefetch={false}
                    href={item.link}
                    className="text-lg font-extrabold"
                  >
                    {item.title}
                  </Link>
                </CardContent>
              ))}
            </Suspense>
          </Card>
        </div>
      </div>
      <div>
        <h2 className="py-4 text-xl font-medium">Markets</h2>
        <Card className="flex flex-col gap-4 p-6 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <DataTable columns={columns} data={resultsWithTitles} />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <MarketsChart ticker={ticker} range={range} interval={interval} />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  )
}
