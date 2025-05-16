import Header from '@/components/Header';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FirebaseAuth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './styles';
import { Apple, Facebook, Google, Logo } from '@/assets';
import { Link, useRouter } from 'expo-router';
import theme from '@/constants/theme';
import { signuplogin } from '@/apis';
import { useAuth } from '@/app/_context/AuthContext';
import axios from 'axios';


const auth = FirebaseAuth();

GoogleSignin.configure({
    webClientId: '449245207141-iniiqt48f1seicmsub9aifk2mc0uer99.apps.googleusercontent.com',
    iosClientId: '449245207141-ahcbr25cbjab9814s247ujlrfuvh1o2j.apps.googleusercontent.com',
});






const Signup = () => {
    const styles = getStyles();
    const router = useRouter();
    const { signIn } = useAuth();

    const handleGoogleSignin = async () => {
        try {
            const response = await GoogleSignin.signIn();
            if (response.data) {
                let { user }: any = response.data;
                let data: any = {
                    familyName: user.familyName,
                    givenName: user.givenName,
                    email: user?.email,
                    name: user?.name,
                    socialId: user?.id,
                    photo: user?.photo
                }
                let apiresponse = await signuplogin(data)
                let authUser = apiresponse.data.data
                signIn(authUser);
                if (authUser?.access_token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${authUser.access_token}`;
                    console.log("✅ Axios default Authorization header set!");
                } else {
                    console.warn("⚠️ No access_token found in authUser");
                }
                router.replace('/welcome')
            }
        } catch (e: any) {
            console.log(e?.response, "error.......")
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Sign Up" />
            </View>
            <View style={styles.content}>
                <Image source={Logo} style={{ marginBottom: 20 }} />
                <View style={styles.section} >
                    {/* <Text style={styles.text} >Begin with creating new free account. This helps you keep your learning way easier.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => router.replace('/welcome')}>
                        <Text style={styles.button_text}>
                            Continue with Email
                        </Text>
                    </TouchableOpacity> */}
                </View>
                {/* <Text style={{ ...styles.text, marginVertical: 20 }} >Or</Text> */}
                <View style={styles.section} >
                    <TouchableOpacity style={styles.button_outline} onPress={() => null}>
                        <Image source={Apple} />
                        <Text style={{ ...styles.button_text, color: theme.color.dark }}>
                            Continue with Apple
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.button_outline} onPress={() => null}>
                        <Image source={Facebook} />
                        <Text style={{ ...styles.button_text, color: theme.color.dark }}>
                            Continue with Facebook
                        </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.button_outline} onPress={handleGoogleSignin}>
                        <Image source={Google} />
                        <Text style={{ ...styles.button_text, color: theme.color.dark }} >
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ ...styles.text, marginBottom: 20 }} >By using EcoRide , you agree to the Terms and Privacy Policy.</Text>
        </SafeAreaView>
    )
}

export default Signup