import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStyles } from './styles';
import Header from '@/components/Header';
import { LeafOutline } from '@/assets';
import { Ionicons } from '@expo/vector-icons';
import { getBalance, getSig } from '@/apis';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';

const DepositFromFiat = () => {
  const styles = getStyles();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [balance, setBalance] = useState(null);
  const [lockedBalance, setLockedBalance] = useState(null);
  const [flag, setFlag] = useState(false);

  const { openWithInAppBrowser, generateUrlForSigning, updateSignature } = useMoonPaySdk({
    sdkConfig: {
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: 'pk_test_EDhed9ciRs9A7GqjyjhhgWufhZQ0sxy',
      },
    },
    browserOpener: {
      open: async (url: string) => {
        await Linking.openURL(url);
      },
    },
  });

  const fetchSignature = async () => {
    try {
      const unsignedUrl = generateUrlForSigning({ variant: 'inapp-browser' });
      if (!unsignedUrl) throw new Error('Failed to generate MoonPay URL.');
      const response = await getSig(encodeURIComponent(unsignedUrl));
      updateSignature(response.data.data);
    } catch (err: any) {
      Alert.alert('Error', 'Could not initialize MoonPay flow.');
    }
  };

  const getWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await getBalance();
      setLoading(false);
      setBalance(response?.data?.data?.balance || 0);
      setLockedBalance(response?.data?.data?.lockedBalance || 0)
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch balance');
    }
  };

  useEffect(() => {
    getWalletBalance();
  }, [flag]);

  const pay = async () => {
    if (!value) {
      Alert.alert('Amount is required');
      return;
    }

    try {
      setLoading(true);
      await fetchSignature();
      setLoading(false);
      openWithInAppBrowser();
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Could not initialize MoonPay flow.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
            <Header title="Add USDT" />
          </View>

          <View style={styles.card_container}>
            <View style={styles.card}>
              <Image source={LeafOutline} style={styles.card_image} />
              <Text style={styles.title_text}>EcoRide Wallet</Text>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                <View>
                            <Text style={styles.text} >
                                Available Balance
                            </Text>
                            <Text style={styles.big_text} >
                                {balance !== null && lockedBalance !== null ? `USDC ${balance - lockedBalance}`:''}
                                {loading ? <ActivityIndicator/>:''}
                            </Text>
                            <Text>Locked Balance ({lockedBalance})</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setFlag(!flag)} >
                  <Ionicons name='refresh-outline' size={30} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.text}>How Much ?</Text>
            <TextInput
              style={styles.input}
              placeholder="$30"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              autoCapitalize="none"
              value={value}
              onChangeText={setValue}
            />
            <View style={styles.warning_container}>
              <Ionicons name="alert-circle-outline" size={25} />
              <Text style={styles.text}>Add minimum 10 USDC</Text>
            </View>
          </View>

          <View style={styles.button_container}>
            <TouchableOpacity style={styles.button} onPress={pay}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.button_text}>Pay</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default DepositFromFiat;
