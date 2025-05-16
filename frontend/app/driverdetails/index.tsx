import Header from '@/components/Header'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import theme from '@/constants/theme'
import { LeafCircle, Seat, Vehicle } from '@/assets'
import { useApp } from '../_context/AppContext'
import { useAuth } from '../_context/AuthContext'
import { bookRide, getBalance } from '@/apis'
import PaymentModal from '@/components/PaymentModal';


const DriverDetails = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const styles = getStyles();
    const { rideDetail, filter } = useApp();
    const { kyc } = useAuth();
    const router = useRouter()

    const dateObj = new Date(rideDetail?.startTime);
    const s_date = dateObj.toISOString().split('T')[0]; // '2024-05-12'
    const s_time = dateObj.toISOString().split('T')[1].slice(0, 5); // '14:30'
    const joined = new Date(rideDetail?.userId?.createdAt).getFullYear()
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [open, setOpen] = useState(false);


    const snapPoints = useMemo(() => ['1%', '50%'], []);


    const handleSelectedSeat = (index: number) => {
        setSelectedSeats((prev: any) => {
            if (prev.includes(index)) {
                // If already selected, unselect it
                return prev.filter((i: any) => i !== index);
            } else {
                // Else select it
                return [...prev, index];
            }
        });
    };


    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);


    const handleModal = () => {
        if (!selectedSeats.length) {
            Alert.alert('Missing Seat', 'Please select seat')
            return
        }
        setOpen(true);
    }

    const handleRequestRide = async () => {
        try {
            setOpen(false);
            setLoading(true)
            if (balance && balance >= rideDetail?.cost) {
                let data = {
                    pickup: { ...filter?.startLocation },
                    dropoff: { ...filter?.endLocation }
                }
                let response = await bookRide(rideDetail._id, data);
                console.log(response.data);
                setLoading(false)
                if (response?.data) {
                    bottomSheetRef.current?.expand();
                }
            } else {
                setLoading(false)
                router.push('/wallet')
            }
        } catch (e: any) {
            setLoading(false)
            console.log(e.response?.data)
            Alert.alert('Error', 'Faild to request ride')
        }
    }

    const getWalletBalance = async () => {
        try {
            const response = await getBalance();
            //   console.log(response.data);
            //   console.log(kyc)
            setBalance(response?.data?.data?.balance - response?.data?.data?.lockedBalance || 0);
        } catch (e) {
            Alert.alert('Error', 'Failed to fetch balance');
        }
    };

    useEffect(() => {
        getWalletBalance();
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                    <Header title="Driver Details" />
                </View>
                <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                    <View style={styles.cardHeader}>
                        <View style={{ alignItems: 'center' }} >
                            <Image
                                source={{ uri: rideDetail?.userId?.photo }}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.name}>{rideDetail?.userId?.givenName} {rideDetail?.userId?.familyName}</Text>
                            <View style={styles.infoRow}>
                                <Ionicons name="calendar" size={14} color="black" />
                                <Text style={styles.text_sm}>{s_date}</Text>
                                <Ionicons name="time" size={14} color="black" />
                                <Text style={styles.text_sm}>{s_time}</Text>
                                <Ionicons name="car" size={14} color="black" />
                                <Text style={styles.text_sm}>{rideDetail?.seats - rideDetail?.occupied} Seats</Text>
                            </View>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.price}>${rideDetail?.cost}</Text>
                        </View>
                    </View>
                    <View style={styles.stops_container} >
                        <View style={styles.stop_item}>
                            <View style={styles.location_wrapper} >
                                <Ionicons name="location" size={18} color={theme.color.dark} />
                            </View>
                            <Text style={styles.stopLabel}>Pickup :</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stopAddress}>
                                    {rideDetail?.startLocation?.address}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stop_item}>
                            <View style={styles.dropoff_wrapper} >
                                <Ionicons name="ellipse" size={15} color={theme.color.red} />
                            </View>
                            <Text style={styles.stopLabel}>Drop off :</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stopAddress}>
                                    {rideDetail?.endLocation?.address}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.info_container} >
                        <View style={styles.info_item} >
                            <Text>Rating</Text>
                            <View style={styles.rating_container} >
                                <Ionicons name="star" size={12} color={theme.color.golden} />
                                <Text style={styles.text}>{rideDetail?.userId?.rating}</Text>
                            </View>
                        </View>
                        {/* <View style={styles.info_item} >
                        <Text>Total Rides</Text>
                        <View style={styles.total_rides} >
                            <Text style={styles.text}>56</Text>
                        </View>
                    </View> */}
                        <View style={styles.info_item} >
                            <Text>Joined</Text>
                            <View style={styles.joined} >
                                <Text style={styles.text}>{joined}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.passenger_container}>
                        <Text style={styles.title_text}>Co-Passengers</Text>
                        <View style={styles.seats_container}>
                            {Array(rideDetail?.seats - rideDetail?.occupied).fill(0).map((seat, i) => {
                                const isSelected = selectedSeats.includes(i);

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={[
                                            styles.seat_item,]}
                                        onPress={() => handleSelectedSeat(i)}
                                    >
                                        <View style={{ ...styles.seat_image, backgroundColor: isSelected ? theme.color.lightgreen : theme.color.light_blue }}>
                                            <Image source={Seat} style={{ width: 25, height: 25 }} />
                                        </View>
                                        <Text style={styles.text}>{isSelected ? 'Selected' : 'Empty Seat'}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.line} />
                    <View style={styles.vehicle_detail_container} >
                        <Text style={styles.title_text} >Vehicle Details</Text>
                        <View style={styles.vehicle_detail} >
                            <Image source={{ uri: rideDetail?.vehicleId?.image }}
                                style={{ width: 100, height: 70, borderRadius: 10 }}
                            />
                            <View style={styles.vehicle_info} >
                                <Text style={styles.text_bold} >{rideDetail?.vehicleId?.make} {rideDetail?.vehicleId?.model}</Text>
                                <Text style={styles.text_gray} >{rideDetail?.vehicleId?.registration}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.button_container} >
                        {/* <TouchableOpacity style={{
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
                    >
                        <Text style={{
                            fontSize: 14,
                            color: theme.color.dark,
                            fontWeight: 400,
                            fontFamily: 'Sora'
                        }}>
                            Message
                        </Text>
                    </TouchableOpacity> */}

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
                            onPress={() => handleModal()}
                        >
                            {loading ? <ActivityIndicator /> : <Text style={{
                                fontSize: 14,
                                color: theme.color.white,
                                fontWeight: 400,
                                fontFamily: 'Sora'
                            }}>
                                Request Ride
                            </Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <PaymentModal cost={rideDetail?.cost} balance={balance} open={open} setOpen={setOpen} handleSubmit={handleRequestRide}  pickup={rideDetail?.startLocation?.address} dropoff={rideDetail?.endLocation?.address} /> 
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop
                            {...props}
                            enableTouchThrough={false}
                            pressBehavior="none"
                            appearsOnIndex={1}
                            disappearsOnIndex={-1}
                            opacity={0.7}
                        />
                    )}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <View style={styles.success_container}>
                            <Image source={LeafCircle} />
                            <Text style={styles.title_text}>Success</Text>
                            <Text style={{ textAlign: 'center' }}>
                                Your EcoRide request has been submitted successfully.
                            </Text>
                            <TouchableOpacity
                                style={{ ...styles.button, width: '90%', marginTop: 10 }}
                                onPress={() => router.push('/(tabs)/myrides')}
                            >
                                <Text style={styles.button_text}>View Your Rides</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Text style={{ fontWeight: '700' }}>Add more</Text>
                            </TouchableOpacity> */}
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default DriverDetails