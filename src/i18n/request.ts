import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = (await cookies()).get("seller_locale")?.value || "en-BD";

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  };
});
