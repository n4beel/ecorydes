import Header from '@/components/Header';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import FirebaseAuth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './signup/styles';
import { Apple, Facebook, Google, Logo, MainScreen } from '@/assets';
import { Link, Redirect, useRouter } from 'expo-router';
import theme from '@/constants/theme';
import { signuplogin } from '@/apis';
import { useAuth } from '@/app/_context/AuthContext';
import axios from 'axios';

// Get device dimensions
const { height: screenHeight } = Dimensions.get('window');

GoogleSignin.configure({
  webClientId: '449245207141-iniiqt48f1seicmsub9aifk2mc0uer99.apps.googleusercontent.com',
  iosClientId: '449245207141-ahcbr25cbjab9814s247ujlrfuvh1o2j.apps.googleusercontent.com',
});

const Home = () => {
  const router = useRouter();
  const { user, signIn } = useAuth();
  const styles = getStyles();

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
          photo: user?.photo,
        };
        let apiresponse = await signuplogin(data);
        let authUser = apiresponse.data.data;
        signIn(authUser);
        if (authUser?.access_token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${authUser.access_token}`;
          console.log('✅ Axios default Authorization header set!');
        } else {
          console.warn('⚠️ No access_token found in authUser');
        }
        router.replace('/welcome');
      }
    } catch (e: any) {
      console.log(e, 'error.......');
    }
  };

  if (user) {
    return <Redirect href='/(tabs)/home' />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Main Image */}
          <View
            style={{
              width: '100%',
              height: screenHeight * 0.45,
              marginTop: 10,
            }}
          >
            <Image
              source={MainScreen}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                position:'absolute',
                left:-80
              }}
            />
          </View>

          {/* Bottom Section */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingBottom: 30,
            }}
          >
            {/* Logo */}
            <Image source={Logo} style={{ marginTop: screenHeight * 0.03 }} />

            {/* Buttons */}
            <View
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                marginTop: screenHeight * 0.05,
              }}
            >
              <TouchableOpacity style={styles.button_outline} onPress={() => null}>
                <Image source={Apple} />
                <Text style={{ ...styles.button_text, color: theme.color.dark }}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>

              {/* Uncomment if Facebook is enabled */}
              {/* <TouchableOpacity style={styles.button_outline} onPress={() => null}>
                <Image source={Facebook} />
                <Text style={{ ...styles.button_text, color: theme.color.dark }}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.button_outline} onPress={handleGoogleSignin}>
                <Image source={Google} />
                <Text style={{ ...styles.button_text, color: theme.color.dark }}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
