import Header from '@/components/Header'
import React, { useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Image, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { getStyles } from './styles'
import theme from '@/constants/theme'
import { CarIcon, Person } from '@/assets'
import polyline from '@mapbox/polyline'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getRideDetails, updateDriverLocation, updateStatusDriver, updateStatusPassenger } from '@/apis'
import { useAuth } from '../_context/AuthContext'
import {
    Pusher,
} from '@pusher/pusher-websocket-react-native';
import * as Location from 'expo-location';
import { useLocationTracker } from '@/hooks/useLocationTracker'
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';


const MyRideDetails = () => {
    const { id } = useLocalSearchParams();
    const styles = getStyles();
    const router = useRouter();
    const [ride, setRide] = useState<null | any>(null);
    const [loading, setLoading] = useState(false);
    const [isDriver, setDriver] = useState(false);


    const getRide = async () => {
        try {
            if (id) {
                setLoading(true);
                let response = await getRideDetails(id as string);
                setRide(response.data?.data?.rideRequest);
                setDriver(response.data?.data?.isDriver);
                setLoading(false);
            }
        } catch (e: any) {
            setLoading(false);
            console.log(e.response?.data);
            Alert.alert('Error', 'Failed to fetch ride details.');
        }
    }

    useEffect(() => {
        getRide()
    }, [id]);




    const getDate = (date: any) => {
        const s_date = isToday(new Date(date))
            ? 'Today'
            : isTomorrow(new Date(date))
                ? 'Tomorrow'
                : isYesterday(new Date(date))
                    ? 'Yesterday'
                    : format(new Date(date), 'dd MMM yyyy');
        return s_date
    }


    const handleRoute = () => {
        router.push({
            pathname: '/ride/[id]',
            params: {
                id: ride?._id,
            },
        });
    }
    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                    <Header title="Ride Details" />
                </View>
                {ride ? (
                    <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                        {isDriver && (
                            <View style={{ backgroundColor: theme.color.light_gray, padding: 10, borderRadius: 10 }} >
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }} >
                                            <Ionicons name='calendar-clear-outline' size={15} />
                                            <Text style={{ fontSize: 12 }} >
                                                {getDate(ride?.startTime)}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }} >
                                            <Ionicons name='calendar-clear-outline' size={15} />
                                            <Text style={{ fontSize: 12 }} >

                                                {format(new Date(ride?.startTime), 'hh:mm a')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.priceBox}>
                                        <Text style={styles.price}>${ride?.cost}</Text>
                                    </View>
                                </View>

                                <>
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
                                </>
                            </View>
                        )}
                        {!isDriver && (
                            <View style={styles.cardHeader}>
                                <View style={{ alignItems: 'center' }} >
                                    <Image
                                        source={{ uri: ride?.userId?.photo }}
                                        style={styles.avatar}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.name}>{ride?.userId?.givenName} {ride?.userId?.familyName}</Text>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar" size={14} color="black" />
                                        <Text style={styles.text_sm}>
                                            {format(new Date(ride?.startTime), 'dd MMM yyyy')}
                                        </Text>
                                        <Ionicons name="time" size={14} color="black" />
                                        <Text style={styles.text_sm}>
                                            {format(new Date(ride?.startTime), 'hh:mm a')}
                                        </Text>
                                        <Ionicons name="car" size={14} color="black" />
                                        <Text style={styles.text_sm}>{ride?.seats - ride?.occupied} Seats</Text>
                                    </View>
                                </View>
                                <View style={styles.priceBox}>
                                    <Text style={styles.price}>${ride?.cost}</Text>
                                </View>
                            </View>
                        )}
                        {!isDriver && (
                            <>
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
                            </>
                        )}
                        {/* <View style={styles.line} /> */}
                        {isDriver && (
                            <View style={{ marginTop: 20 }} >
                                {ride?.passengers?.map((p: any, i: number) => {
                                    return (
                                        <View 
                                        key={i}
                                        style={{
                                            backgroundColor: theme.color.white,
                                            borderRadius: 10,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 0.5 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 6,
                                            elevation: 1,
                                            paddingVertical: 15,
                                            paddingHorizontal: 20
                                        }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }} >
                                                    <Image
                                                        key={i}
                                                        source={{ uri: p?.passengerId?.photo || 'https://via.placeholder.com/25' }}
                                                        style={{ width: 40, height: 40, borderRadius: 50, opacity: p?.passengerId?.photo ? 1 : 0.3 }}
                                                    />
                                                    <View style={{ flexDirection: 'row', gap: 10 }} >
                                                        <Text>
                                                            {p?.passengerId?.familyName}
                                                        </Text>
                                                        <Text>
                                                            {p?.passengerId?.givenName}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} >
                                                    <Ionicons name='location-outline' size={15} />
                                                    <Text style={{ fontSize: 10 }} >
                                                        1.2M away from you
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.routeSection, backgroundColor: '' }}>
                                                <Ionicons name="location" size={18} color={theme.color.dark} style={{ marginTop: 15 }} />
                                                <Text style={{ ...styles.routeText, paddingRight: 10 }}>
                                                    {p?.pickup?.address}
                                                </Text>
                                            </View>

                                            <View style={styles.routeSection}>
                                                <Ionicons name="ellipse" size={15} color={theme.color.primary} />
                                                <Text style={{ ...styles.routeText, paddingRight: 10 }}>
                                                    {p?.dropoff?.address}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )}
                        {!isDriver && (
                            <View style={styles.info_container} >
                                <View style={styles.info_item} >
                                    <Text>Rating</Text>
                                    <View style={styles.rating_container} >
                                        <Ionicons name="star" size={12} color={theme.color.golden} />
                                        <Text style={styles.text}>{ride?.userId?.rating}</Text>
                                    </View>
                                </View>

                                <View style={styles.info_item} >
                                    <Text>Joined</Text>
                                    <View style={styles.joined} >
                                        <Text style={styles.text}>{format(ride?.createdAt, 'dd MMM yyyy')}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {/* <View style={styles.line} /> */}
                        {!isDriver && (
                            <View style={styles.passenger_container}>
                                <Text style={styles.title_text}>Co-Passengers</Text>
                                <View style={styles.seats_container}>
                                    {[...Array(ride.seats - ride.passengers.length).fill({}), ...ride.passengers].map((p: any, i: number) => {
                                        if (Object.keys(p).length) {
                                            return (
                                                <Image
                                                    key={i}
                                                    source={{ uri: p?.passengerId?.photo || 'https://via.placeholder.com/25' }}
                                                    style={{ width: 40, height: 40, borderRadius: 50, opacity: p?.passengerId?.photo ? 1 : 0.3 }}
                                                />
                                            )
                                        }
                                        return (
                                            <View key={i} style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: theme.color.light_gray, alignItems: 'center', justifyContent: 'center' }} >
                                                <Ionicons name='person-outline' />
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        )}
                        {/* <View style={styles.line} /> */}
                        {!isDriver && (
                            <View style={styles.vehicle_detail_container} >
                                <Text style={styles.title_text} >Vehicle Details</Text>
                                <View style={styles.vehicle_detail} >
                                    <Image source={{ uri: ride?.vehicleId?.image }}
                                        style={{ width: 100, height: 70, borderRadius: 10 }}
                                    />
                                    <View style={styles.vehicle_info} >
                                        <Text style={styles.text_bold} >{ride?.vehicleId?.make} {ride?.vehicleId?.model}</Text>
                                        <Text style={styles.text_gray} >{ride?.vehicleId?.registration}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                ) : ''}
                {ride ? (
                    <View style={styles.button_container} >
                        <TouchableOpacity style={{
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
                            onPress={handleRoute}
                        >
                            <Text style={{
                                fontSize: 14,
                                color: theme.color.white,
                                fontWeight: 400,
                                fontFamily: 'Sora'
                            }}>
                                {isDriver ? 'Start' : 'View'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : ''}
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default MyRideDetails