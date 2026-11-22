// タイムラインの絞り込み用の検索ボックス
export default function SearchBox({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="投稿を検索"
    />
  );
}
