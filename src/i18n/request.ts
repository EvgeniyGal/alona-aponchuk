import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, LOCALE_COOKIE, parseAppLocale } from "./config";

export default getRequestConfig(async () => {
  const jar = await cookies();
  const locale = parseAppLocale(jar.get(LOCALE_COOKIE)?.value ?? defaultLocale);
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
