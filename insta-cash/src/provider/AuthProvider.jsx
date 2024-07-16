import React, { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import auth from '../utils/firebase.config';
export const AuthContext = createContext()
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                setLoading(false)
            }
            return unsubscribe;
        });
    }, [])
    const createUser = async (email, password) => {
        setLoading(true)
        return await createUserWithEmailAndPassword(auth, email, password)
    }
    const loginUser = async (email, hashedPassword) => {
        setLoading(true)
        return await signInWithEmailAndPassword(auth, email, hashedPassword)
    }
    const authFunc = { createUser, user, loginUser }
    return (
        <AuthContext.Provider value={authFunc}>
            {children}
        </AuthContext.Provider>
    )
}
