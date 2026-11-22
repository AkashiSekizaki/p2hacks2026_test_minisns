import { createContext, useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

const STORAGE_KEY = "currentUser";

// localStorage からユーザー情報を読む
function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

// ログインしているユーザーの情報（{ uid, email, displayName }）を
// アプリ全体で共有するためのContext
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // ユーザー情報を保存する（Context と localStorage の両方）
  const saveUser = (u) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
