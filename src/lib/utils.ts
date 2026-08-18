import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const adminTableHeadClass =
  "border-b-2 border-blue/30 bg-blue-soft text-[13px] font-semibold uppercase tracking-wide text-graphite";
