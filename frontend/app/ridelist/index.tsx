import Header from '@/components/Header'
import React, { useEffect } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import theme from '@/constants/theme'
import { useApp } from '../_context/AppContext'

const RideList = () => {
    const {  rideList, loadingRides, fetchRides, handleRideDetail, page, total, increasePage, handleReset } = useApp();
    const styles = getStyles();
    const router = useRouter();

    const handleNavigate = (ride: any) => {
        handleRideDetail(ride)
        router.push('/driverdetails');
    }
    useEffect(() => {
        setTimeout(()=>{
                    fetchRides()
        },200)
    }, [page])

    useEffect(() => {
        handleReset()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Matching Rides" />
            </View>
            <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                {loadingRides ? <ActivityIndicator /> : ""}
                {rideList && rideList.length ? rideList.map((ride, i) => {
                    const dateObj = new Date(ride?.startTime);
                    const s_date = dateObj.toISOString().split('T')[0]; // '2024-05-12'
                    const s_time = dateObj.toISOString().split('T')[1].slice(0, 5); // '14:30'
                    return (
                        <TouchableOpacity key={i} style={styles.card} onPress={() => handleNavigate(ride)}>
                            <View style={styles.cardHeader}>
                                <View style={{ alignItems: 'center' }} >
                                    <Image
                                        source={{ uri: ride?.userId?.photo }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.rating_container} >
                                        <Ionicons name="star" size={12} color={theme.color.golden} />
                                        <Text style={styles.rating}>{ride?.userId?.rating}</Text>
                                    </View>

                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.name}>{ride?.userId?.givenName} {ride?.userId?.familyName}</Text>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar" size={14} color="black" />
                                        <Text style={styles.text_sm}>{s_date}</Text>
                                        <Ionicons name="time" size={14} color="black" />
                                        <Text style={styles.text_sm}>{s_time}</Text>
                                        <Ionicons name="car" size={14} color="black" />
                                        <Text style={styles.text_sm}>{ride?.seats - ride?.occupied} Seats</Text>
                                    </View>
                                </View>
                                <View style={styles.priceBox}>
                                    <Text style={styles.price}>${ride?.cost}</Text>
                                </View>
                            </View>
                            <View style={styles.line} />
                            <View style={styles.routeSection}>
                                <Ionicons name="location" size={18} color={theme.color.dark} />
                                <Text style={{ ...styles.routeText, paddingRight: 10 }}>
                                    {ride?.startLocation?.address}
                                </Text>
                            </View>
                            <View style={styles.routeSection}>
                                <Ionicons name="ellipse" size={15} color={theme.color.primary} />
                                <Text style={{ ...styles.routeText, paddingRight: 10 }}>
                                    {ride?.endLocation?.address}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }) : ''}
                {page < total && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }} >
                        <TouchableOpacity onPress={increasePage}>
                            <Text style={{ color: theme.color.blue }} >Load More</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default RideList
