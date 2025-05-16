import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { getStyles } from './styles'; // adjust the import path as needed
import { Ionicons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@/constants/theme';
import { RegisterCar } from '@/assets';
import { useAuth } from '@/app/_context/AuthContext';
import { useRouter } from 'expo-router';

const menuItems = [
    { icon: <Ionicons name="people" size={20} />, label: 'Saved Places', key: '' },
    { icon: <Ionicons name="time" size={20} />, label: 'Ride history', key: 'history' },
    { icon: <Ionicons name="wallet" size={20} />, label: 'Wallet', key: 'wallet' },
    { icon: <Entypo name="graduation-cap" size={20} />, label: 'Student Discounts', key: '' },
    { icon: <Ionicons name="share-social" size={20} />, label: 'Refer a friend', key: '' },
    { icon: <Ionicons name="call" size={20} />, label: 'Rate us', key: '' },
    { icon: <Ionicons name="book" size={20} />, label: 'Terms & Condition', key: 'terms' },
    { icon: <Ionicons name="bug" size={20} />, label: 'Report a bug', key: '' },
    { icon: <Ionicons name="log-in" size={20} />, label: 'Sign Out', key: 'signout' },
];

const Profile = () => {
    const { kyc , user} = useAuth()
    const styles = getStyles();
    const { signOut } = useAuth();
    const router = useRouter();


    const handleClickOnItem = (key: string) => {
        if (key === "signout") {
            signOut();
            router.replace('/')
            return
        }
        if (key === "") {
            Alert.alert("Coming Soon")
            return
        }

        if (key === "wallet") {

            router.push('/wallet')
            return
        }

        if (key === "wallet") {
            router.push('/wallet')
            return
        }

        if (key === "terms") {

            router.push('/terms')
            return
        }

        if (key === "history") {
            router.push('/ridehistory')
            return
        }

    }


    console.log(user,"user")

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, marginBottom: 5 }}>
                <Image
                    source={{ uri: user?.photo }} // Replace with actual user image
                    style={styles.image}
                />
                <View>
                    <Text style={styles.titleText}>{user?.givenName} {user?.familyName}</Text>
                    {/* <Text style={styles.text}>0336 369 2581</Text> */}
                </View>
                <TouchableOpacity style={styles.edit}>
                    <Feather name="edit-2" size={10} color={theme.color.dark} />
                </TouchableOpacity>
            </View>

            {!kyc?.vehicles?.length && (
                <TouchableOpacity style={styles.register_vehicle} onPress={()=>router.push('/vehiclekyc')} >
                    <Text style={{ fontWeight: 700 }} >Register your Vehicle </Text>
                    <Image source={RegisterCar} />
                </TouchableOpacity>
            )}
            {/* Menu Items */}
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.list_item} onPress={() => handleClickOnItem(item.key)}>
                        {item.icon}
                        <Text style={styles.list_text}>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default Profile;
