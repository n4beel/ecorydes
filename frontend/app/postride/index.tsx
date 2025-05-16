import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { getStyles } from './styles';
import Step1 from '@/components/postride/step1';
import Step2 from '@/components/postride/step2';
import Step3 from '@/components/postride/step3';
import { LeafCircle } from '@/assets';
import theme from '@/constants/theme';
import Header from '@/components/Header';
import { postRide } from '@/apis';

// Define LocationData with lat and lng as number | null
type LocationData = {
    address: string;
    latitude: number;
    longitude: number;
};

const PostRide = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const router = useRouter();
    const styles = getStyles();
    const [step, setStep] = useState(0);


    const [loading, setLoading] = useState(false);

    // Step 1
    const [startLocation, setStartLocation] = useState<LocationData>({ address: '', latitude: 0, longitude: 0 })
    const [endLocation, setEndLocation] = useState<LocationData>({ address: '', latitude: 0, longitude: 0 });


    // Step 2
    const [isRecurring, setIsisRecurring] = useState(false);
    const [returnTrip, setReturnTrip] = useState(false);
    const [seats, setSeats] = useState(1);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [days, setDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    });

    // Step 3
    const [cost, setCost] = useState(0);


    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleNext = async () => {

        if (step === 0 && (!startLocation?.address || !endLocation?.address)) {
            Alert.alert('Missing Location', 'Please provide both pickup and dropoff locations.');
            return;
        }
        if (step === 1 && !validateStep2()) {
            Alert.alert('Missing Fields', 'Please fill out all the information.');
            return;
        }

        if (step === 2 && !validateStep3()) {
            Alert.alert('Missing Cost', 'Please add cost.');
            return;
        }

        if (step === 2) {
            let data: any = {
                startLocation: startLocation,
                endLocation: endLocation,
                returnTrip: returnTrip,
                startTime: startTime,
                cost: parseFloat(cost.toString()),
                seats: seats,
                isRecurring: isRecurring,
                days: days
            }
            if (returnTrip) {
                data.endTime = endTime
            } else {
                data.endTime = startTime
            }
            // if(isRecurring){
            //     data.days = days;
            // }
            try {
                setLoading(true);
                let response = await postRide(data);
                if (response.data) {
                    bottomSheetRef.current?.expand();
                }
                setLoading(false);
            } catch (e: any) {
                setLoading(false);
                console.log(e.response)
            }
        } else {
            setStep(step + 1);
        }
    };

    const validateStep3 = () => {
        console.log(cost)
        if (!cost) return false;

        return true;
    }

    const validateStep2 = () => {
        if (!startTime) return false;

        if (returnTrip && !endTime) return false;

        if (isRecurring) {
            const hasSelectedDay = Object.values(days).some(day => day === true);
            if (!hasSelectedDay) return false;
        }

        if (seats < 1) return false;

        return true;
    };


    const handleBack = () => {
        setStep(step - 1);
    };

    const snapPoints = useMemo(() => ['1%', '50%'], []);

    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                    <Header title="Post a Ride" />
                </View>

                <ScrollView style={{ flex: 1 }}>
                    {step === 0 && (
                        <Step1
                            pickup={startLocation}
                            setPickup={setStartLocation}
                            dropoff={endLocation}
                            setDropoff={setEndLocation}
                        />
                    )}
                    {step === 1 && (
                        <Step2
                            isRecurring={isRecurring}
                            setIsisRecurring={setIsisRecurring}
                            returnTrip={returnTrip}
                            setReturnTrip={setReturnTrip}
                            seats={seats}
                            setSeats={setSeats}
                            days={days}
                            setDays={setDays}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            endTime={endTime}
                            setEndTime={setEndTime}
                        />
                    )}
                    {step === 2 && <Step3 cost={cost} setCost={setCost} />}
                </ScrollView>

                <View style={styles.button_container}>
                    {step > 0 && (
                        <TouchableOpacity style={styles.button_outline} onPress={handleBack}>
                            <Text style={{ ...styles.button_text, color: theme.color.dark }}>Back</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity disabled={loading} style={{ ...styles.button, width: step < 1 ? '100%' : '50%' }} onPress={handleNext}>
                        <Text style={styles.button_text}>{step === 2 ? 'Submit' : 'Next'}</Text>
                    </TouchableOpacity>
                </View>

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
                                Your EcoRide request has been submitted successfully. You will be notified when you have a match.
                            </Text>
                            <TouchableOpacity
                                style={{ ...styles.button, width:'90%', marginTop: 10 }}
                                onPress={() => router.push('/(tabs)/myrides')}
                            >
                                <Text style={styles.button_text}>View Your Rides</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Text style={{ fontWeight: '700' }}>Add more</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default PostRide;
