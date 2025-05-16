import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles';
import { View, Text, TouchableOpacity, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import Header from '@/components/Header';
import { LeafOutline } from '@/assets';
import { Ionicons } from '@expo/vector-icons';
import Dollar from '@/components/svgs/dollar';
import Bank from '@/components/svgs/bank';
import { Link, useRouter } from 'expo-router';
import { getBalance } from '@/apis';



const menuItems = [
    { icon: <Dollar size={20} />, label: 'Deposit from Crypto', link: '/depositfromcrypto' },
    { icon: <Dollar size={20} />, label: 'Deposit from Bank', link: '/depositfromfiat' },
    { icon: <Bank size={20} />, label: 'Send Money to Bank Account', link: '' },
    { icon: <Ionicons name="time-outline" size={20} />, label: 'Transaction History', link: '' },
    { icon: <Ionicons name="diamond-outline" size={20} />, label: 'Unclaimed Rewards', link: '/unclaimed' },
];



const Wallet = () => {
    const router = useRouter();
    const styles = getStyles();
    const [balance, setBalance] = useState(null);
    const [lockedBalance, setLockedBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [credits, setCredit] = useState(0)



    const handleRoute = (route: any) => {
        router.push(route)
    }


    const getWalletBalance = async () => {
        try {
            
            setLoading(true);
            const response = await getBalance();
            console.log(response.data.data)
            setBalance(response?.data?.data?.balance || 0);
            setLockedBalance(response?.data?.data?.lockedBalance || 0)
            setCredit(response?.data?.data?.credits)
            setLoading(false);
        } catch (e) {
            setLoading(false);
            Alert.alert('Error', 'Failed to fetch balance');
        }
    };

    useEffect(() => {
        getWalletBalance();
    }, [flag]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }} >
                <Header title='Wallet' />
            </View>
            <View style={styles.card_container} >
                <View style={styles.card} >
                    <Image source={LeafOutline} style={styles.card_image} />
                    <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Text style={styles.title_text} >EcoRide Wallet</Text>
                        <Text style={styles.title_text} >
                            {loading ? <ActivityIndicator /> : ''}
                            {credits !== null ? `RYD ${credits.toFixed(2)}` : ''}
                        </Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <View>
                            <Text style={styles.text} >
                                Available Balance
                            </Text>
                            <Text style={styles.big_text} >
                                {balance !== null && lockedBalance !== null ? `USDC ${balance - lockedBalance}` : ''}
                                {loading ? <ActivityIndicator /> : ''}
                            </Text>
                            <Text>Locked Balance ({lockedBalance})</Text>
                        </View>
                        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setFlag(!flag)} >
                            <Ionicons name='refresh-outline' size={30} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.list_item} onPress={() => handleRoute(item?.link)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} >
                            {item.icon}
                            <Text style={styles.list_text}>{item.label}</Text>
                        </View>
                        <Ionicons name='chevron-forward-outline' />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}

export default Wallet