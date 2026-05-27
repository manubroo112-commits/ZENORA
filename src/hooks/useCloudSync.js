import { useCallback, useEffect, useRef, useState } from "react";
import { getFirebaseServices, isFirebaseConfigured } from "../services/firebase";

export function useCloudSync(data, setData) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(isFirebaseConfigured ? "offline" : "not-configured");
  const cloudReady = useRef(false);
  const latestData = useRef(data);

  useEffect(() => {
    latestData.current = data;
  }, [data]);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    let unsubscribe = () => {};
    let cancelled = false;

    async function connect() {
      const [{ onAuthStateChanged }, { doc, getDoc, serverTimestamp, setDoc }, services] = await Promise.all([
        import("firebase/auth"),
        import("firebase/firestore"),
        getFirebaseServices()
      ]);
      if (cancelled || !services) return;

      unsubscribe = onAuthStateChanged(services.auth, async (firebaseUser) => {
      setUser(firebaseUser);
      cloudReady.current = false;

      if (!firebaseUser) {
        setStatus("signed-out");
        return;
      }

      setStatus("loading");
      const reference = doc(services.db, "users", firebaseUser.uid);
      const snapshot = await getDoc(reference);

      if (snapshot.exists() && snapshot.data().zenoraData) {
        setData(snapshot.data().zenoraData);
      } else {
        await setDoc(reference, {
          zenoraData: latestData.current,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      cloudReady.current = true;
      setStatus("synced");
      });
    }

    connect();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [setData]);

  useEffect(() => {
    if (!isFirebaseConfigured || !user || !cloudReady.current) return undefined;

    setStatus("saving");
    const timeout = setTimeout(async () => {
      const [{ doc, serverTimestamp, setDoc }, services] = await Promise.all([
        import("firebase/firestore"),
        getFirebaseServices()
      ]);
      if (!services) return;

      await setDoc(doc(services.db, "users", user.uid), {
        zenoraData: data,
        email: user.email,
        displayName: user.displayName,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setStatus("synced");
    }, 700);

    return () => clearTimeout(timeout);
  }, [data, user]);

  const login = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setStatus("not-configured");
      return;
    }

    setStatus("loading");
    try {
      const [{ signInWithPopup }, services] = await Promise.all([
        import("firebase/auth"),
        getFirebaseServices()
      ]);
      await signInWithPopup(services.auth, services.googleProvider);
    } catch {
      const [{ signInWithRedirect }, services] = await Promise.all([
        import("firebase/auth"),
        getFirebaseServices()
      ]);
      await signInWithRedirect(services.auth, services.googleProvider);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    const [{ signOut }, services] = await Promise.all([
      import("firebase/auth"),
      getFirebaseServices()
    ]);
    await signOut(services.auth);
    cloudReady.current = false;
    setStatus("signed-out");
  }, []);

  return {
    user,
    status,
    configured: isFirebaseConfigured,
    login,
    logout
  };
}
