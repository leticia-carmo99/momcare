import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const comparePassword = (inputPassword, storedPassword) => {
    return inputPassword === storedPassword; 
};

const MotherContext = createContext();

export const MotherProvider = ({ children }) => {
    const [motherData, setMotherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [motherId, setMotherId] = useState(null);
    const [error, setError] = useState(null);

    const login = async (email, senha) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const usersRef = collection(db, "maes"); 
            const q = query(usersRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                throw new Error("Usuário não encontrado ou credenciais inválidas.");
            }

            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();
            
            const isMatch = comparePassword(senha, userData.senha); 

            if (!isMatch) {
                throw new Error("Senha incorreta.");
            }
            const id = userDoc.id;
            setMotherId(id); 
            localStorage.setItem('motherId', id); 

        } catch (err) {
            setError(err.message);
            setMotherId(null);
            setMotherData(null);
            console.error("Erro no login:", err);
            throw err; 
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setMotherId(null);
        setMotherData(null);
        localStorage.removeItem('motherId');
    };

    useEffect(() => {
        const storedId = localStorage.getItem('motherId');
        if (storedId) {
            setMotherId(storedId);
        } else {
            setIsLoading(false); 
        }
    }, []);

    useEffect(() => {
        const fetchMotherData = async () => {
            if (!motherId) {
                setMotherData(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const docRef = doc(db, "maes", motherId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    delete data.senha; 
                    setMotherData({ id: docSnap.id, ...data });
                } else {
                    console.error("Documento da mãe não encontrado!");
                    logout(); 
                }
            } catch (err) {
                setError("Falha ao carregar dados da mãe.");
                console.error("Erro ao carregar dados:", err);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        fetchMotherData();
    }, [motherId]);


    const value = {
        motherData,
        isLoading,
        error,
        motherId, 
        login,
        logout,
    };


      return (
    <MotherContext.Provider value={{ motherData, setMotherData }}>
      {children}
    </MotherContext.Provider>
  );
};

export const useMother = () => useContext(MotherContext);
