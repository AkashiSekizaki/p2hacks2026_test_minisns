import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // 投稿一覧をリアルタイムに取得（新しい順）
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setError("投稿の取得に失敗しました: " + err.message),
    );
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addDoc(collection(db, "posts"), {
        text,
        authorUid: user?.uid,
        authorName: user?.displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      setError("投稿に失敗しました: " + err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card">
        <h2>共有する</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今日あったことを書こう"
          required
        />
        <button type="submit">投稿</button>
        {error && <p className="error">{error}</p>}
      </form>

      <h2>タイムライン</h2>
      {posts.length === 0 && <p>まだ投稿がありません。</p>}
      {posts.map((p) => (
        <article key={p.id} className="card">
          <p>{p.text}</p>
          <small>
            {(p.authorName === "" || p.authorName === null) && "名無し"} ・{" "}
            {p.createdAt?.toDate().toLocaleString("ja-JP") ?? "送信中"}
          </small>
          <div>
            <Link to={`/posts/${p.id}`}>
              詳細{p.authorUid === user?.uid && "・編集"}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
