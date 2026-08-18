import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        // Admin status is determined by the presence of a document at
        // admins/{uid}. The security rules enforce the same check on
        // every write, so this flag only controls what the UI shows.
        try {
          const snap = await getDoc(doc(db, "admins", nextUser.uid));
          setIsAdmin(snap.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const signIn = () =>
    signInWithPopup(auth, googleProvider).catch((err) => {
      // Popup closed by user is not an error worth surfacing.
      if (err?.code !== "auth/popup-closed-by-user") console.error(err);
    });

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
