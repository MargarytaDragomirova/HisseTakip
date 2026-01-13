import { Card, CardContent } from "@/components/ui/card"
import { BIST_STOCKS } from "@/data/bistStocks"
import { fetchScrapedData } from "@/lib/scraper/fetchScrapedData"


type scrapedData = {
  symbol: string,
  indicators: Record<string, string>
  pdfUrl: string,
  stockOffer: string
}

export default async function HalkYatirimIndicators({ ticker }: { ticker: string }) {

  if (!BIST_STOCKS.includes(ticker)) {
    return;
  }

  const newsData: scrapedData = await fetchScrapedData(ticker)
  return (
    <>
      <p className="text-xl font-semibold text-neutral-500 dark:text-neutral-500" style={{ padding: "24px" }}>
        Halk Yatırım Analizi
      </p>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        {Object.keys(newsData.indicators).map((item: any, index: number) => (
          <Card className="min-h-[15rem]">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-500" style={{ padding: "24px" }}>
              {item}
            </p>
            <CardContent>
              {Object.values(newsData.indicators)[index]}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xl font-semibold text-neutral-500 dark:text-neutral-500" style={{ padding: "24px" }}>
        İş Yatırım Analizi
      </p>
      <div dangerouslySetInnerHTML={{ __html: newsData.stockOffer }} />
    </>
  )
}
