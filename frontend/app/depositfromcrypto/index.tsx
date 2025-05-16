import React from 'react'
import { View, Text, TextInput, Clipboard, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';

import { getStyles } from './styles';
import Header from '@/components/Header';
import { QR } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_context/AuthContext';

const DepositFromCrypto = () => {
    const styles = getStyles();
    const { kyc } = useAuth();


    const handleCopy = () => {
        if (kyc?.publicKey) {
            Clipboard.setString(kyc.publicKey);
            Alert.alert('Copied', 'Address copied to clipboard.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.custom_header}>
                <Header title="Deposit" />
                <View style={styles.qr_container} >
                    <Image source={{uri:`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${kyc?.publicKey}`}} 
                    style={{
                        width:150,
                        height:150,
                        transform: [{ translateY: 10 }]
                    }} />
                </View>
            </View>
            <View style={styles.content} >
                <Text style={styles.text}>Address</Text>
                <View style={styles.address_container} >
                    <Text style={styles.text_dark} >{kyc?.publicKey}</Text>
                </View>
                <TouchableOpacity style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 55,
                    backgroundColor: theme.color.white,
                    borderWidth: 1,
                    borderColor: theme.color.dark,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    marginTop: 20
                }}
                onPress={handleCopy}
                >
                    <Text style={{
                        fontSize: 14,
                        color: theme.color.dark,
                        fontWeight: 400,
                        fontFamily: 'Sora'
                    }}>
                        Copy Address
                    </Text>
                </TouchableOpacity>
                <View style={styles.warning_container} >
                    <Ionicons name='alert-circle-outline' size={25} />
                    <Text style={styles.text} >
                        This address can only be used to receive compatible tokens
                    </Text>
                </View>
                <View style={styles.network_container} >
                    <Text style={styles.text} >Network</Text>
                    <View style={styles.solana}>
                        <Text style={styles.text_dark} >SOLANA</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default DepositFromCrypto