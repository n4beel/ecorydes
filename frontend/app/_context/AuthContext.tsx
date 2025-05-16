import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'; // ✅

type AuthContextType = {
    user: any;
    signIn: (userData: any) => void;
    signOut: () => void;
    handleType: (type: string) => void;
    loading: boolean;
    type: string;
    kyc: any;
    setKyc: (kycData: any) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: () => {},
    signOut: () => {},
    handleType: () => {},
    loading: true,
    type: '',
    kyc: null,
    setKyc: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('');
    const [kyc, setKycState] = useState<any>(null); // ✅ new

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);

                    if (parsedUser?.access_token) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.access_token}`;
                        console.log("✅ Axios Authorization header set from stored user");
                    }
                }
            } catch (e) {
                console.log('Failed to load user', e);
            } finally {
                setLoading(false);
            }
        };
        loadUserFromStorage();
    }, []);

    const signIn = async (userData: any) => {
        setUser(userData);
        try {
            await SecureStore.setItemAsync('user', JSON.stringify(userData));

            if (userData?.access_token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
                console.log("✅ Axios Authorization header set on login");
            }
        } catch (e) {
            console.log('Failed to save user', e);
        }
    };

    const signOut = async () => {
        setUser(null);
        try {
            await SecureStore.deleteItemAsync('user');
            delete axios.defaults.headers.common['Authorization'];
            console.log("✅ Axios Authorization header removed on logout");
        } catch (e) {
            console.log('Failed to remove user', e);
        }
    };

    const handleType = (type: string) => {
        setType(type);
    };

    const setKyc = (kycData: any) => {
        setKycState(kycData);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, handleType, loading, type, kyc, setKyc }}>
            {children}
        </AuthContext.Provider>
    );
};
