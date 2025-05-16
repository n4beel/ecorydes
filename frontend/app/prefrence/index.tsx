import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './styles';
import { Apple, Driver, Facebook, Google, Logo, Passenger } from '@/assets';
import { Link, useRouter } from 'expo-router';
import theme from '@/constants/theme';
import { getkycStatus } from '@/apis';
import { useAuth } from '../_context/AuthContext';

const Prefrence = () => {
    const styles = getStyles();
    const router = useRouter();
    const { handleType, setKyc, kyc } = useAuth();
    const [isDriver, setDriver] = useState(false);


    const handleGetKyc = async () => {
        try {
            let response = await getkycStatus();
            setKyc(response.data?.data)
        } catch (e: any) {
            console.log(e.response.data)
        }
    }
    useEffect(() => {
        handleGetKyc()
    }, [])



    const handleNavigateDriver = () => {
        if (kyc) {
            if (kyc.vehicles && kyc.vehicles?.length) {
                router.push('/(tabs)/home');
            } else {
                handleType('driver');
                router.push('/kyc');
            }
        }
    }

    const handleNavigatePassenger = () => {
        if (kyc) {
            if (kyc.vehicles && kyc.idDocument?.length) {
                router.push('/(tabs)/home');
            } else {
                handleType('passenger');
                router.push('/kyc');
            }
        }
    }


    const handleNext = ()=>{
    
        if(isDriver){
            handleNavigateDriver()
        }else{
            handleNavigatePassenger()
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Commute Preference" />
            </View>
            <View style={styles.content} >
                <Text style={styles.title_text} >
                    Onboard as an Driver or Passenger
                </Text>
                <Text style={styles.text} >
                    Please choose one of the following options
                    you may change it anytime
                </Text>
                <View style={styles.radios} >
                    <TouchableOpacity style={styles.radio_container} onPress={() => setDriver(true)} >
                        <Image source={Driver} style={styles.radio_image} />
                        <Text style={styles.radio_text} >I’m Driver</Text>
                        <View style={{ ...styles.circle, backgroundColor: isDriver ? theme.color.primary : '' }} ></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.radio_container} onPress={() => setDriver(false)} >
                        <Image source={Passenger} style={styles.radio_image} />
                        <Text style={styles.radio_text} >I’m Passenger</Text>
                        <View style={{ ...styles.circle, backgroundColor: !isDriver ? theme.color.primary : '' }} ></View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.button_container} >
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
                }}
                    onPress={() => handleNext()}
                >
                    <Text style={{
                        fontSize: 14,
                        color: theme.color.dark,
                        fontWeight: 400,
                        fontFamily: 'Sora'
                    }}>
                        Let's Go
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 55,
                    backgroundColor: theme.color.dark,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                }}
                    onPress={() => handleNavigatePassenger()}
                >
                    <Text style={{
                        fontSize: 14,
                        color: theme.color.white,
                        fontWeight: 400,
                        fontFamily: 'Sora'
                    }}>
                        Passenger
                    </Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    )
}

export default Prefrence