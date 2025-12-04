import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const comparePassword = (input, stored) => input === stored;
const ProfessionalContext = createContext();

export const ProfessionalProvider = ({ children }) => {
  const [professionalData, setProfessionalData] = useState(null);
  const [professionalId, setProfessionalId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { setIsLoading(false); }, []);

  const login = async (usernameOrEmail, senha) => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "profissionais"),
        where("username", "==", usernameOrEmail)
      );
      const snap1 = await getDocs(q);

      const q2 = query(
        collection(db, "profissionais"),
        where("email", "==", usernameOrEmail)
      );
      const snap2 = await getDocs(q2);

      const snap = !snap1.empty ? snap1 : snap2;
      if (snap.empty) throw new Error("Usuária não encontrada.");

      const docRef = snap.docs[0];
      const data = docRef.data();

      if (!comparePassword(senha, data.senha))
        throw new Error("Senha incorreta.");

      setProfessionalData({ id: docRef.id, ...data });
      setProfessionalId(docRef.id);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setProfessionalData(null);
    setProfessionalId(null);
  };

  const signup = async (dados) => {
    setIsLoading(true);
    setError(null);
    try {
      const { username, email, cpf, senha } = dados;

      const q1 = query(collection(db, "profissionais"), where("username", "==", username));
      if (!(await getDocs(q1)).empty) throw new Error("Nome de usuário já existe.");

      const q2 = query(collection(db, "profissionais"), where("email", "==", email));
      if (!(await getDocs(q2)).empty) throw new Error("E-mail já cadastrado.");

      const docRef = await addDoc(collection(db, "profissionais"), {
        username, email, cpf, senha
      });

      const newUser = { id: docRef.id, username, email, cpf };
      setProfessionalData(newUser);
      setProfessionalId(docRef.id);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfessional = async (data) => {
    if (!professionalId) return;
    const ref = doc(db, "profissionais", professionalId);
    await updateDoc(ref, data);
    setProfessionalData((old) => ({ ...old, ...data }));
  };

  const value = {
    professionalData,
    professionalId,
    isLoading,
    error,
    login,
    logout,
    signup,
    updateProfessional,
  };

  return <ProfessionalContext.Provider value={value}>{children}</ProfessionalContext.Provider>;
};

export const useProfessional = () => useContext(ProfessionalContext);
