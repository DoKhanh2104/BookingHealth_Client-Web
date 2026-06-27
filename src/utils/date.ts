/** Tiện ích ngày tháng dùng chung (định dạng 'YYYY-MM-DD'). */

export const pad = (n: number): string => String(n).padStart(2, '0');

/** Date → 'YYYY-MM-DD' (theo giờ địa phương). */
export const toYMD = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Hôm nay dưới dạng 'YYYY-MM-DD'. */
export const todayYMD = (): string => toYMD(new Date());
