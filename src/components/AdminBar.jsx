import { useAuth } from "../hooks/useAuth";

/**
 * Fixed status bar shown only while signed in. Admins get confirmation
 * that edit mode is active; non-admin accounts get a clear explanation
 * (the security rules would reject their writes anyway).
 */
export default function AdminBar() {
  const { user, isAdmin, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="admin-bar" role="status">
      <span>
        {isAdmin ? (
          <>
            <strong>Admin mode</strong> — signed in as {user.displayName}.
            Edit controls are visible on the page.
          </>
        ) : (
          <>
            Signed in as {user.displayName}, but this account does not have
            admin access.
          </>
        )}
      </span>
      <button className="btn btn-ghost" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
