import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SITE } from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);

const AUTO_TITLE_PREFIX = "开发动态#";

/**
 * 展示用标题：有 `title` 用原文；否则为 `开发动态#M月D日`（按 `SITE.timezone` 或单条
 * 的 `timezone` 算「月/日」）。
 */
export function getMomentDisplayTitle(
  title: string | undefined,
  pubDatetime: Date,
  momentTimezone?: string | null
): string {
  const custom = title?.trim();
  if (custom) {
    return custom;
  }
  const tz = momentTimezone ?? SITE.timezone;
  const monthDay = dayjs(pubDatetime).tz(tz).format("M月D日");
  return `${AUTO_TITLE_PREFIX}${monthDay}`;
}
