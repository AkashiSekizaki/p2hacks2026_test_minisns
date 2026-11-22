import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../AuthContext.jsx";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(null);
  const [error, setError] = useState("");
  const { saveUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await setDoc(doc(db, "users", cred.user.uid), { displayName });

      // 登録したユーザーの情報をアプリ内で使えるように保存する
      saveUser({ uid: cred.user.uid, email: cred.user.email, displayName });
      navigate("/");
    } catch (err) {
      setError("登録に失敗しました: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>新規登録</h2>
      <label>
        表示名（任意）
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>
      <label>
        メールアドレス
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        パスワード（6文字以上）
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>
      <button type="submit">登録する</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
