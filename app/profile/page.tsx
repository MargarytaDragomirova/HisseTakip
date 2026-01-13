import { getSession } from "@/lib/auth"
import type { Metadata } from "next"
import AuthDialog from "./components/authDialog";
import MarketsChart from "@/components/chart/MarketsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { range } from "lodash";
import { Suspense } from "react";
import { columns } from "../screener/components/columns";
import { DataTable } from "../screener/components/data-table";
import { Link } from "next-view-transitions";
import { validateInterval, validateRange } from "@/lib/yahoo-finance/fetchChartData";
import { DEFAULT_RANGE, DEFAULT_INTERVAL } from "@/lib/yahoo-finance/constants";
import { Interval } from "@/types/yahoo-finance";
import YahooFinance from "yahoo-finance2";
import { StarIcon } from "@radix-ui/react-icons";
import { CellContext } from "@tanstack/react-table";
import { ScreenerQuote } from "yahoo-finance2/modules/screener";
import { getFavoriteStocks } from "@/lib/stock";


export const metadata: Metadata = {
    title: "Finly: Stock screener",
    description: "Find the best stocks to buy now with the Finly stock screener.",
}

export default async function ProfilePage({
    searchParams,
}: {
    searchParams?: {
        ticker?: string
        range?: string
        interval?: string
    }
}) {
    const session = await getSession();

    let ticker = "";
    let resultsWithTitles = [];
    const range = validateRange(searchParams?.range || DEFAULT_RANGE)
    const interval = validateInterval(
        range,
        (searchParams?.interval as Interval) || DEFAULT_INTERVAL
    )

    if (session) {
        const tickers = await getFavoriteStocks();
        ticker = tickers[0] ? tickers[0].symbol : "XU100.IS"

        const yahooFinance = new YahooFinance();

        const promises = tickers.map(({ symbol }) =>
            yahooFinance.quoteCombine(symbol)
        )
        const results = await Promise.all(promises)
        resultsWithTitles = results.map((result: any, index: any) => ({
            ...result,
            shortName: tickers[index].shortName,
            isFav: true
        }))
    }

    return (
        <div>
            {session ? (
                <div className="flex flex-col gap-4">
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
            ) : (
                <div>
                    <AuthDialog />
                </div>
            )}
        </div>
    )
}
