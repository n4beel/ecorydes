import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './home.styles';
import { FindRide, HomeImage, PostRide } from '@/assets';
import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
    const styles = getStyles();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header} >
                <View>
                    <Text style={styles.titleText}>Welcome <Text style={{ color: theme.color.primary }}>Hamza</Text></Text>
                    <Text style={styles.text}>
                        What would you like to do today?
                    </Text>
                </View>
                <TouchableOpacity style={styles.bell} onPress={() => router.push('/notifications')} >
                    <Ionicons name="notifications-outline" size={20} color={theme.color.dark} />
                </TouchableOpacity>
            </View>
            <View style={styles.content} >
                <TouchableOpacity style={styles.action_box} onPress={() => router.push('/postride')} >
                    <View>
                        <Text style={styles.box_text}>Post a Ride</Text>
                        <Text style={styles.text}>
                            Offer a ride nearby
                        </Text>
                    </View>
                    <Image source={PostRide} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action_box} onPress={() => router.push('/find')} >
                    <View>
                        <Text style={styles.box_text}>Find a Ride</Text>
                        <Text style={styles.text}>
                            Take a ride nearby
                        </Text>
                    </View>
                    <Image source={FindRide} style={styles.image} />
                </TouchableOpacity>
            </View>
            <View style={{alignItems:'center', justifyContent:'center', backgroundColor:''}} >
                <View style={{ width: 400, height: 300, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={HomeImage} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Home;