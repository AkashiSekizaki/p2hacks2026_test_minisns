// 投稿日時を「3分前」のような相対表示にする
export function formatRelativeTime(date) {
  if (!date) return "送信中";
  const min = Math.floor((Date.now() - date.getTime()) / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}日前`;
  return date.toLocaleDateString("ja-JP");
}
