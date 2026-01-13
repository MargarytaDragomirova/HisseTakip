import { Row } from "@tanstack/react-table";
import { ScreenerQuote } from "yahoo-finance2/modules/screener";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";

export async function addFavoriteStock(
  userId: number,
  stock: { symbol: string; shortName: string }
) {
  return prisma.favoriteStock.create({
    data: {
      symbol: stock.symbol,
      shortName: stock.shortName,
      userId,
    },
  });
}


export async function getFavoriteStocks() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const id: number = user.id
  return prisma.favoriteStock.findMany({
    where: { userId: id },
    orderBy: { id: "desc" },
  });
}


export async function removeFavoriteStock(userId: number, symbol: string) {
  return prisma.favoriteStock.delete({
    where: {
      userId_symbol: {
        userId,
        symbol,
      },
    },
  });
}

