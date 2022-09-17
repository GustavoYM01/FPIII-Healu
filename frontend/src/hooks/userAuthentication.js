import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // cleanup
  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

  // register - sign up
  const createUser = async (data) => {
    checkIfIsCancelled();

    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, {
        displayName: data.userName,
      });

      setLoading(false);

      return user;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMsg;

      if (error.message.includes("Password")) {
        systemErrorMsg = "A senha precisa conter pelo menos 6 caracteres";
      } else if (error.message.includes("email-already")) {
        systemErrorMsg = "E-mail já cadastrado";
      } else {
        systemErrorMsg =
          "Ocorreu um erro, por favor tente novamente mais tarde";
      }
      setLoading(false);
      setError(systemErrorMsg);
    }
  };

  // logout - sign out
  const logout = async () => {
    checkIfIsCancelled();
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
  };

  // login sign in
  const login = async (data) => {
    checkIfIsCancelled();

    setLoading(true);
    setError(false);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setLoading(false);
    } catch (error) {
      let systemErrorMsg;

      if (error.message.includes("user-not-found")) {
        systemErrorMsg = "Usuário não encontrado";
      } else if (error.message.includes("wrong-password")) {
        systemErrorMsg = "Senha incorreta";
      } else {
        systemErrorMsg = "Ocorreu um erro, por favor tente mais tarde";
      }
      setError(systemErrorMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login,
  };
};
