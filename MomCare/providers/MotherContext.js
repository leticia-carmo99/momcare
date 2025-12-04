import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const comparePassword = (input, stored) => input === stored;
const MotherContext = createContext();

export const MotherProvider = ({ children }) => {
  const [motherData, setMotherData] = useState(null);
  const [motherId, setMotherId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { setIsLoading(false); }, []);

  const login = async (usernameOrEmail, senha) => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "maes"),
        where("username", "==", usernameOrEmail)
      );
      const snap1 = await getDocs(q);

      const q2 = query(
        collection(db, "maes"),
        where("email", "==", usernameOrEmail)
      );
      const snap2 = await getDocs(q2);

      const snap = !snap1.empty ? snap1 : snap2;
      if (snap.empty) throw new Error("Usuária não encontrada.");

      const docRef = snap.docs[0];
      const data = docRef.data();

      if (!comparePassword(senha, data.senha))
        throw new Error("Senha incorreta.");

      setMotherData({ id: docRef.id, ...data });
      setMotherId(docRef.id);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setMotherData(null);
    setMotherId(null);
  };

  const signup = async (dados) => {
    setIsLoading(true);
    setError(null);
    try {
      const { username, email, cpf, senha } = dados;

      const q1 = query(collection(db, "maes"), where("username", "==", username));
      if (!(await getDocs(q1)).empty) throw new Error("Nome de usuário já existe.");

      const q2 = query(collection(db, "maes"), where("email", "==", email));
      if (!(await getDocs(q2)).empty) throw new Error("E-mail já cadastrado.");

      const docRef = await addDoc(collection(db, "maes"), {
        username, email, cpf, senha,
        sorrisosHoje: 0, tempoSonoHoras: 0, tempoSonoMinutos: 0,
        ultimaAtualizacao: new Date()
      });

      const newUser = { id: docRef.id, username, email, cpf };
      setMotherData(newUser);
      setMotherId(docRef.id);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMother = async (data) => {
    if (!motherId) return;
    const ref = doc(db, "maes", motherId);
    await updateDoc(ref, data);
    setMotherData((old) => ({ ...old, ...data }));
  };

  const value = {
    motherData,
    motherId,
    isLoading,
    error,
    login,
    logout,
    signup,
    updateMother,
  };

  return <MotherContext.Provider value={value}>{children}</MotherContext.Provider>;
};

export const useMother = () => useContext(MotherContext);
