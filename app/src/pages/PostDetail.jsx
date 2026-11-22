import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext.jsx";
import { formatRelativeTime } from "../utils/formatTime.js";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getDoc(doc(db, "posts", id))
      .then((snap) => {
        if (!snap.exists()) return setError("投稿が見つかりません");
        setPost({ id: snap.id, ...snap.data() });
        setText(snap.data().text);
      })
      .catch((err) => setError("取得に失敗しました: " + err.message));
  }, [id]);

  const isOwner = post && user && post.authorUid === user.uid;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "posts", id), {
        text,
        updatedAt: serverTimestamp(),
      });
      navigate("/");
    } catch (err) {
      setError("更新に失敗しました: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("削除しますか？")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      navigate("/");
    } catch (err) {
      setError("削除に失敗しました: " + err.message);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>読み込み中...</p>;

  return (
    <div className="card">
      <h2>投稿</h2>
      {isOwner ? (
        <form onSubmit={handleUpdate}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit">更新</button>
          <button type="button" onClick={handleDelete} className="danger">
            削除
          </button>
        </form>
      ) : (
        <p>{post.text}</p>
      )}
      <small>
        投稿者: {post.authorName || "名無し"} ・{" "}
        {formatRelativeTime(post.createdAt?.toDate())}
      </small>
    </div>
  );
}
