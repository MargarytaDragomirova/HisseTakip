"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, login, registerAndLogin } from "@/lib/auth";
import { revalidatePath } from "next/cache";


export async function favoriteStockAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const symbol = formData.get("symbol") as string;
  const shortName = formData.get("shortName") as string;

  if (!symbol || !shortName) {
    throw new Error("Invalid data");
  }

  const existing = await prisma.favoriteStock.findUnique({
    where: {
      userId_symbol: {
        userId: user.id,
        symbol,
      },
    },
  });

  if (existing) {
    await prisma.favoriteStock.delete({
      where: {
        userId_symbol: {
          userId: user.id,
          symbol,
        },
      },
    });
    revalidatePath("/profile");
    return { status: "removed" };
  }

  await prisma.favoriteStock.create({
    data: {
      userId: user.id,
      symbol,
      shortName,
    },
  });
  revalidatePath("/profile");
  return { status: "added" };
}

export type AuthState = {
  message?: string;
};

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const mode = formData.get("mode");

  try {
    if (mode === "register") {
      await registerAndLogin(formData);
      return { message: "Kayıt başarılı" };
    } else {
      await login(formData);
      return { message: "Giriş başarılı" };
    }
  } catch (e: any) {
    return {
      message: e?.message ?? "Bilinmeyen bir hata oluştu",
    };
  }
}