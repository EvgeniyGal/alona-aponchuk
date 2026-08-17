import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-graphite">{t("title")}</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          {t("body")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-md bg-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue/90"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
