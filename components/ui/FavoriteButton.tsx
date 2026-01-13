"use client";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { favoriteStockAction } from "@/lib/actions/actions";
import { useState } from "react";
export function FavoriteButton({
  symbol,
  shortName,
  isFav
}: {
  symbol: string;
  shortName: string;
  isFav: boolean | undefined
}) {
  const [fav, setFav] = useState(Boolean(isFav));

  async function action(formData: FormData) {
    await favoriteStockAction(formData);
    if (window.location.pathname != "/profile") {
      setFav((v) => !v); // ⭐ optimistic
    }
  }
  return (
    <form action={action}>
      <input type="hidden" name="symbol" value={symbol} />
      <input type="hidden" name="shortName" value={shortName} />
      <button type="submit">
        {fav
          ?
          <StarFilledIcon className="cursor-pointer text-yellow-500" />
          :
          <StarIcon className="cursor-pointer text-yellow-500" />
        }
      </button>
    </form>
  );
}