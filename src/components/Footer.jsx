import { useAuth } from "../hooks/useAuth";

export default function Footer() {
  const { user, signIn } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span>© {year} Sigurður G. Hjálmarsson</span>
      {!user && (
        <button className="link-quiet" onClick={signIn}>
          Admin sign-in
        </button>
      )}
    </footer>
  );
}
