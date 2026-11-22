import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/formatTime.js";

// 投稿1件の表示。タイムラインと今後のページで共通して使う
export default function PostCard({ post, currentUid }) {
  const isOwner = post.authorUid === currentUid;
  return (
    <article className="card post-card">
      <p>{post.text}</p>
      <small className="post-meta">
        {post.authorName || "名無し"} ・{" "}
        {formatRelativeTime(post.createdAt?.toDate())}
      </small>
      <div>
        <Link to={`/posts/${post.id}`}>詳細{isOwner && "・編集"}</Link>
      </div>
    </article>
  );
}
