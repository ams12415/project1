import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

export const register = async (email, password, setUser) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  setUser(userCredential.user);
  return userCredential.user;
};

export const login = async (email, password, setUser) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  setUser(userCredential.user);
  return userCredential.user;
};

export const isEmailInUse = async (email) => {
  const methods = await fetchSignInMethodsForEmail(auth, email);
  return methods;
};