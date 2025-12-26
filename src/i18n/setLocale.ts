"use server";
import { cookies } from "next/headers";
export const SetLocale = async (locale: string) => {
  (await cookies()).set("seller_locale", locale);
};
