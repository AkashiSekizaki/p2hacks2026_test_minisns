import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext.jsx";

export default function Me() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  // 自分の投稿一覧を取得
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "posts"), where("authorUid", "==", user.uid));
    getDocs(q)
      .then((snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setPosts(list);
      })
      .catch((err) => setError("取得に失敗しました: " + err.message));
  }, [user?.uid]);

  return (
    <div>
      <div className="card">
        <h2>マイページ</h2>
        <p>表示名: {user?.displayName}</p>
        <p>メール: {user?.email}</p>
        <p>UID: {user?.uid}</p>
      </div>

      <h2>自分の投稿</h2>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && <p>投稿がありません。</p>}
      {posts.map((p) => (
        <article key={p.id} className="card">
          <p>{p.text}</p>
          <Link to={`/posts/${p.id}`}>詳細・編集</Link>
        </article>
      ))}
    </div>
  );
}
