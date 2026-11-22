import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext(null);

// Firebase のログイン状態を onAuthStateChanged で 1 か所だけ購読し、
// アプリ全体に { uid, email, displayName } を配る。
// 新規登録でも既存ユーザーのログインでも、同じ経路を通る。
async function toAppUser(fbUser) {
  if (!fbUser) return null;
  let displayName = fbUser.displayName;
  if (!displayName) {
    // users/{uid} が無い既存アカウント（コンソールで作成）でも落ちないようにする
    try {
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      displayName = snap.exists() ? snap.data().displayName : null;
    } catch {
      displayName = null;
    }
  }
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: displayName,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(await toAppUser(fbUser));
      setLoading(false);
    });
    return unsub;
  }, []);

  // 登録直後にプロフィール(displayName)を更新したあと、Context に反映する
  const refreshUser = async () => {
    await auth.currentUser?.reload();
    setUser(await toAppUser(auth.currentUser));
  };

  const logout = () => signOut(auth);

  if (loading) return <p>読み込み中...</p>;

  return (
    <AuthContext.Provider value={{ user, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
