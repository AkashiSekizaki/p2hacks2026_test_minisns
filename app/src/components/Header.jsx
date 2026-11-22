import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header>
      <Link to="/" className="logo">ミニSNS</Link>
      <nav>
        <Link to="/">タイムライン</Link>
        <Link to="/me">マイページ</Link>
        {user ? (
          <button onClick={handleLogout}>ログアウト</button>
        ) : (
          <>
            <Link to="/login">ログイン</Link>
            <Link to="/signup">新規登録</Link>
          </>
        )}
      </nav>
    </header>
  );
}
