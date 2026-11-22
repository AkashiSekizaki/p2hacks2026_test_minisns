import { useEffect, useState } from "react";
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
import PostCard from "../components/PostCard.jsx";

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
        <h2>つぶやく</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="いまどうしてる？"
          required
        />
        <button type="submit">投稿</button>
        {error && <p className="error">{error}</p>}
      </form>

      <h2>タイムライン</h2>
      {posts.length === 0 && <p>まだ投稿がありません。</p>}
      {posts.map((p) => (
        <PostCard key={p.id} post={p} currentUid={user?.uid} />
      ))}
    </div>
  );
}
