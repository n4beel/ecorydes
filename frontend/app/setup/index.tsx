import { useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../_context/AuthContext';
import { getkycStatus } from '@/apis';
import { getStyles } from './styles';


const Setup = () => {
    const router = useRouter();
    const { setKyc } = useAuth();
    const styles = getStyles();

    const handleGetKyc = async () => {
        try {
            let response = await getkycStatus();
            let kyc = response?.data?.data;
            setKyc(kyc);
            if (kyc) {
                if (kyc.vehicles && kyc.vehicles?.length) {
                    router.push('/(tabs)/home');
                } else {
                    router.push('/prefrence');
                }
            }
        } catch (e: any) {
            console.log(e.response.data)
        }
    }
    useEffect(() => {
        handleGetKyc()
    }, [])

    return (
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
    )
}

export default Setup