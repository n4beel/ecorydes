import Header from '@/components/Header'
import React, { useEffect, useRef, useState } from 'react'
import { View, Image, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { getStyles } from './styles'
import theme from '@/constants/theme'
import { CarIcon, Person } from '@/assets'
import polyline from '@mapbox/polyline'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { getRideDetails, updateDriverLocation, updateStatusDriver, updateStatusPassenger } from '@/apis'
import { useAuth } from '../_context/AuthContext'
import {
    Pusher,
} from '@pusher/pusher-websocket-react-native';
import * as Location from 'expo-location';
import { useLocationTracker } from '@/hooks/useLocationTracker'
import EndrideModal from '@/components/EndRideModal'



const THROTTLE_INTERVAL = 2000; // 3 seconds


const pusher = Pusher.getInstance();

const GOOGLE_MAPS_APIKEY = 'AIzaSyC_qENeuRAe_Weq0xdxyAuJoCIJnooKcaw';

const Ride = () => {
    const lastSentRef = useRef<number>(0);
    const { location, errorMsg, startTracking, stopTracking } = useLocationTracker();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const styles = getStyles();
    const mapRef = useRef<MapView>(null);


    const [carPosition, setCarPosition] = useState<any>(location);

    const [pickup, setPickup] = useState<any>(null);
    const [dropoff, setDropoff] = useState<any>(null);
    const [myLocationPickup, setMyLocationPickup] = useState<any>(null);
    const [myLocation, setMyLocation] = useState<any>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);
    const [ride, setRide] = useState<null | any>(null);
    const [loading, setLoading] = useState(false);
    const [isDriver, setDriver] = useState(false);
    const [passengers, setPassengers] = useState<any[]>([]);
    const [showPickupBtn, setPickupBtn] = useState(false);
    const [dropoffBtn, setDropoffBtn] = useState(false);
    const [passengerStatus, setPassengerStatus] = useState('');
    const [driverStatus, setDriverStatus] = useState('');
    const [open, setOpen] = useState(false);

    const fetchRoutePoints = async () => {
        try {
            let waypoints = ''
            if (passengers.length) {
                waypoints = passengers.flatMap(p => [
                    `via:${p.pickup.latitude},${p.pickup.longitude}`,
                    `via:${p.dropoff.latitude},${p.dropoff.longitude}`
                ]).join('|');
            };


            const url = `https://maps.googleapis.com/maps/api/directions/json` +
                `?origin=${pickup.latitude},${pickup.longitude}` +
                `&destination=${dropoff.latitude},${dropoff.longitude}` +
                `&waypoints=${waypoints}` +
                `&key=${GOOGLE_MAPS_APIKEY}`;

            const resp = await fetch(url);
            const respJson = await resp.json();
            // console.log(respJson, 'response........')
            if (respJson.routes.length) {
                const points = polyline.decode(respJson.routes[0].overview_polyline.points);
                const routeCoords = points.map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng
                }));
                setRouteCoordinates(routeCoords);
            }
        } catch (error) {
            console.log('Error fetching route:', error);
        }
    };

    useEffect(() => {
        if (pickup && dropoff) {
            if (pickup.latitude && pickup.longitude && dropoff.latitude && dropoff.longitude) {
                fetchRoutePoints();
            }
        }
    }, [pickup, dropoff]);

    const getRide = async () => {
        try {
            if (id) {
                setLoading(true);
                let response = await getRideDetails(id as string);
                setPickup(response.data?.data?.rideRequest?.startLocation);
                setDropoff(response.data?.data?.rideRequest?.endLocation);
                setPassengers(response.data?.data?.rideRequest?.passengers)
                setRide(response.data?.data?.rideRequest);
                setDriver(response.data?.data?.isDriver);
                setDriverStatus(response.data?.data?.rideRequest?.status);
                setCarPosition(response.data?.data?.rideRequest?.startLocation);

                if (!response.data?.data?.isDriver) {
                    let passenger = response.data?.data?.rideRequest?.passengers.filter((p: any) => p.passengerId._id === user?.id);
                    setMyLocationPickup(passenger?.length ? passenger[0]?.pickup : null)
                    setPassengerStatus(passenger?.length ? passenger[0]?.status : '')
                    setMyLocation(passenger?.length ? passenger[0]?.dropoff : null);
                } else {
                    // update location when driver and ride is started
                    if (response.data?.data?.rideRequest?.status === 'started') {
                        startTracking()
                    }
                }
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

    useEffect(() => {
        if (location) {
            setCarPosition(location)
        }
    }, [location])

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of Earth in km
        const toRad = (deg: number) => deg * (Math.PI / 180); // Convert degrees to radians

        const lat1Rad = toRad(lat1);
        const lon1Rad = toRad(lon1);
        const lat2Rad = toRad(lat2);
        const lon2Rad = toRad(lon2);

        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // Convert to meters

        return distance;
    };



    const handleLocationEvent = (e: any) => {
        let _data = JSON.parse(e?.data)
        console.log(_data, "=========================", isDriver);
        setCarPosition(_data)
        setPickup(_data)
    }

    const handleStatusEvent = (e: any) => {
        let _data = JSON.parse(e?.data)
        if (_data?.passenger === user.id && _data?.nearPickup) {
            setPickupBtn(true);
            // return
        }
        if (_data?.passenger === user.id && _data?.nearDropoff) {
            setDropoffBtn(true);
            // return
        }
    }

    useEffect(() => {
        let subscription: any;

        const connectPusher = async () => {
            try {
                await pusher.init({
                    apiKey: '284075912fc578cad16c',
                    cluster: 'ap2'
                });
                await pusher.connect();
                subscription = await pusher.subscribe({
                    channelName: id as string,
                    onEvent: (event) => {
                        if (event.eventName === "location") {
                            handleLocationEvent(event);
                        } else if (event.eventName === "status") {
                            handleStatusEvent(event);
                        }
                    }
                });
            } catch (e) {
                console.log(`ERROR: ${e}`);
            }
        };

        connectPusher();

        return () => {
            if (subscription) {
                pusher.unsubscribe({ channelName: id as string });
            }
        };
    }, [id]);

    const updateLocationToServer = async () => {
        if (!carPosition || routeCoordinates.length === 0) return;

        const now = Date.now();
        if (now - lastSentRef.current < THROTTLE_INTERVAL) return; // throttle here

        lastSentRef.current = now; // update last sent time

        const trimThreshold = 5;
        const nextIndex = routeCoordinates.findIndex(coord => {
            const distance = haversineDistance(
                carPosition.latitude,
                carPosition.longitude,
                coord.latitude,
                coord.longitude
            );
            return distance < trimThreshold;
        });

        if (isDriver) {
            try {
                const { timestamp, ...rest } = carPosition;
                await updateDriverLocation(id as string, rest);
            } catch (e: any) {
                console.log('Update failed:', e);
            }
        }

        if (nextIndex > 0) {
            setRouteCoordinates(prev => prev.slice(nextIndex));
        } else {
            console.log(isDriver);
        }
    };
    useEffect(() => {
        updateLocationToServer();
    }, [carPosition]);



    const handleDriverStatus = async (status: string) => {
        try {
            setLoading(true)
            let data = { rideStatus: status }
            let response = await updateStatusDriver(id as string, data);
            if (driverStatus === 'pending') {
                startTracking()
                setDriverStatus('started')
            }
            if (driverStatus === 'started') {
                stopTracking();
                setDriverStatus('completed')
            }
            setLoading(false)
        } catch (e: any) {
            setLoading(false)
            console.log(e.response?.data?.message);
            Alert.alert('Error', e.response?.data ? e.response?.data?.message : 'Failed to update status.');
        }
    }


    const handlePassengerStatus = async (status: string) => {
        try {
            setLoading(true)
            let data = { passengerStatus: status }
            let response = await updateStatusPassenger(id as string, data);
            if (passengerStatus === 'pending') {
                setPassengerStatus('picked')
            }
            if (passengerStatus === 'picked') {
                setPassengerStatus('dropped')
                setOpen(true);
            }
            setLoading(false)
        } catch (e: any) {
            console.log(e);
            setLoading(false)
            Alert.alert('Error', 'Failed to update status.');
        }
    }
    // console.log(JSON.stringify(location));

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Start" />
            </View>
            {ride ? (
                <View style={{ flex: 1 }}>
                    <MapView
                        ref={mapRef}
                        style={{ width: '100%', height: '100%' }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: pickup?.latitude,
                            longitude: pickup?.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        {/* Dropoff Marker */}
                        <Marker coordinate={dropoff} title="Dropoff" pinColor="red" />

                        <Marker coordinate={myLocation} title="My Dropoff" pinColor={theme.color.primary} />

                        {/* Passengers */}
                        {passengers.map((p, i) => (
                            <Marker
                                key={i}
                                coordinate={p?.pickup}
                                title={p.passengerId?.givenName}
                            >
                                <Image
                                    source={{ uri: p.passengerId?.photo }}
                                    style={{ width: 35, height: 35, borderRadius: 50, borderWidth: 4, borderColor: theme.color.primary }}
                                    resizeMode="contain"
                                />
                            </Marker>
                        ))}

                        {/* Moving Car Marker */}
                        {carPosition && (
                            <Marker coordinate={carPosition} title="Driver">
                                <Image source={CarIcon} style={{ width: 40, height: 40 }} resizeMode="contain" />
                            </Marker>
                        )}

                        {/* Route Polyline */}
                        {/* {routeCoordinates.length > 1 && ( */}
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeColor={theme.color.primary}
                            strokeWidth={5}
                        />
                        {/* )} */}
                    </MapView>
                </View>
            ) : null}
            {ride && (
                <View style={styles.bottom_container}>
                    <View style={styles.sheet_header}>
                        <Text style={styles.title_text}>Carpool Companions</Text>
                        <View style={styles.images_container}>
                            {ride.passengers.map((p: any, i: number) => (
                                <Image
                                    key={i}
                                    source={{ uri: p?.passengerId?.photo }}
                                    style={{ width: 25, height: 25, borderRadius: 50 }}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.address_container}>
                        <View style={styles.routeSection}>
                            <Ionicons name="location" size={18} color={theme.color.dark} />
                            {isDriver ? <Text style={{ ...styles.routeText, paddingRight: 20 }}>{ride?.startLocation?.address}</Text> : <Text style={{ ...styles.routeText, paddingRight: 20 }}>{myLocationPickup?.address}</Text>}
                        </View>
                        <View style={styles.routeSection}>
                            <Ionicons name="ellipse" size={15} color={theme.color.primary} />
                            {isDriver ? <Text style={{ ...styles.routeText, paddingRight: 20 }}>{dropoff?.address}</Text> : <Text style={{ ...styles.routeText, paddingRight: 20 }}>{myLocation?.address}</Text>}
                        </View>
                    </View>
                    {isDriver && driverStatus === 'pending' && (
                        <View style={styles.button_container}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => handleDriverStatus('started')}
                            >
                                {loading ? <ActivityIndicator /> : <Text style={styles.button_text}>Start</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                    {isDriver && driverStatus === 'started' && (
                        <View style={styles.button_container}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => handleDriverStatus('completed')}
                            >
                                {loading ? <ActivityIndicator /> : <Text style={styles.button_text}>End</Text>}
                            </TouchableOpacity>
                        </View>
                    )}

                    {!isDriver && showPickupBtn && passengerStatus === 'pending' && (
                        <View style={styles.button_container}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => handlePassengerStatus('picked')}
                            >
                                {loading ? <ActivityIndicator /> : <Text style={styles.button_text}>Picked</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                    {!isDriver && dropoffBtn && passengerStatus === 'picked' && (
                        <View style={styles.button_container}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => handlePassengerStatus('dropped')}
                            >
                                {loading ? <ActivityIndicator /> : <Text style={styles.button_text}>Dropped</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
            {loading && <ActivityIndicator />}
            {open && <EndrideModal id={id as string} pickup={isDriver ? ride?.startLocation?.address : myLocationPickup.address} dropoff={isDriver ? dropoff.address : myLocation.address} cost={ride?.cost} open={open} setOpen={() => null} />}
        </SafeAreaView>
    )
}

export default Ride;