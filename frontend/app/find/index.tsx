import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal, Button, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles'
import { Reverse } from '@/assets'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import theme from '@/constants/theme'
import { useApp } from '../_context/AppContext';

const GOOGLE_API_KEY = 'AIzaSyC_qENeuRAe_Weq0xdxyAuJoCIJnooKcaw'; // Replace with your own key



// Define LocationData with lat and lng as number | null
type LocationData = {
    address: string;
    latitude: number;
    longitude: number;
};

const FindRide = () => {
    const { setFilter } = useApp();
    const styles = getStyles();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [startLocation, setStartLocation] = useState<LocationData>({ address: '', latitude: 0, longitude: 0 })
    const [endLocation, setEndLocation] = useState<LocationData>({ address: '', latitude: 0, longitude: 0 });
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | number | null>(null);
    const [tempDate, setTempDate] = useState<Date>(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // Move 1 day forward
        return tomorrow;
    });
    const [seats, setSeats] = useState(1);
    const [startTime, setStartTime] = useState<any>('');



    const fetchSuggestions = async (input: string) => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                    input
                )}&components=country:pk&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();
            if (data.predictions) {
                setSuggestions(data.predictions);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaceDetails = async (placeId: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();
            if (data.result) {
                return {
                    lat: data.result.geometry.location.lat,
                    lng: data.result.geometry.location.lng,
                };
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
        return null;
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (activeField === 'pickup') {

                fetchSuggestions(startLocation.address);
            } else if (activeField === 'dropoff') {
                fetchSuggestions(endLocation.address);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [startLocation.address, endLocation.address, activeField]);

    const handleSuggestionPress = async (description: string, placeId: string) => {
        const location = await fetchPlaceDetails(placeId);

        if (activeField === 'pickup') {
            setStartLocation({ address: description, latitude: location?.lat, longitude: location?.lng });
        } else if (activeField === 'dropoff') {
            setEndLocation({ address: description, latitude: location?.lat, longitude: location?.lng });
        }
        setSuggestions([]);
        setActiveField(null);
    };

    const handleAdd = () => {
        setSeats(seats + 1)
    }

    const hanldeRemove = () => {
        if (seats === 1) {
            return
        }
        setSeats(seats - 1)
    }

    const handleConfirm = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to today at midnight
        today.setDate(today.getDate() + 1); // Move to tomorrow

        const selectedDate = new Date(tempDate);
        selectedDate.setHours(0, 0, 0, 0); // Set to selected date at midnight

        if (selectedDate < today) {
            alert("Please select a future date (not today).");
        } else {
            setStartTime(tempDate);
            setShowModal(false);
        }
    };


    const handleSubmit = () => {
        let data = {
            startLocation,
            endLocation,
            seats,
            startTime
        }
        if ((!startLocation?.address || !endLocation?.address)) {
            Alert.alert('Missing Location', 'Please provide both pickup and dropoff locations.');
            return;
        }

        setFilter(data)
        router.push('/ridelist')
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Find a ride" />
            </View>
            <View style={styles.content} >
                <View style={styles.section} >
                    <Text style={styles.text}>Where are you going?</Text>
                    {/* Pickup input */}
                    <View style={{ position: 'relative', zIndex: activeField === 'pickup' ? 99 : 1 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Pickup"
                            placeholderTextColor="#aaa"
                            keyboardType="ascii-capable"
                            autoCapitalize="none"
                            value={startLocation.address}
                            onFocus={() => setActiveField('pickup')}
                            onChangeText={(text) => {
                                setStartLocation({ address: text, latitude: 0, longitude: 0 });
                                setActiveField('pickup');
                            }}
                        />
                        {(loading || suggestions.length > 0) && activeField === 'pickup' && (
                            <View style={styles.suggestionsContainer}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={theme.color.primary} />
                                ) : (
                                    <ScrollView keyboardShouldPersistTaps="handled">
                                        {suggestions.map((item) => (
                                            <TouchableOpacity
                                                key={item.place_id}
                                                style={styles.suggestionItem}
                                                onPress={() => handleSuggestionPress(item.description, item.place_id)}
                                            >
                                                <View style={{width:30,height:30, borderRadius:50 , backgroundColor:theme.color.light_gray, alignItems:'center', justifyContent:'center'}} >
                                                      <Ionicons name='location-outline' size={15}/>
                                                </View>
                                                <Text>{item.description}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        )}
                    </View>


                    <TouchableOpacity style={styles.reverse}>
                        <Image source={Reverse} />
                    </TouchableOpacity>
                    {/* Dropoff input */}
                    <View style={{ position: 'relative', zIndex: activeField === 'dropoff' ? 99 : 1, marginTop: 20 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Dropoff"
                            placeholderTextColor="#aaa"
                            keyboardType="ascii-capable"
                            autoCapitalize="none"
                            value={endLocation.address}
                            onFocus={() => setActiveField('dropoff')}
                            onChangeText={(text) => {
                                setEndLocation({ address: text, latitude: 0, longitude: 0 });
                                setActiveField('dropoff');
                            }}
                        />
                        {(loading || suggestions.length > 0) && activeField === 'dropoff' && (
                            <View style={styles.suggestionsContainer}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={theme.color.primary} />
                                ) : (
                                    <ScrollView keyboardShouldPersistTaps="handled">
                                        {suggestions.map((item) => (
                                            <TouchableOpacity
                                                key={item.place_id}
                                                style={styles.suggestionItem}
                                                onPress={() => handleSuggestionPress(item.description, item.place_id)}
                                            >
                                                <Text>{item.description}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        )}
                    </View>

                </View>

                <View style={styles.section} >
                    <Text style={styles.text}>When?</Text>
                    <TouchableOpacity style={styles.input_date} onPress={() => setShowModal(true)}>
                        {startTime ? (
                            <Text style={{ ...styles.text, fontWeight: 400, fontSize: 11 }}>{startTime.toLocaleString()}</Text>
                        ) : (
                            <Text style={styles.date_text}>Pick date & time</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.text} >Seat Needed</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15 }} >
                        <TouchableOpacity onPress={hanldeRemove}>
                            <Ionicons name='remove-circle-outline' size={30} />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 }}>{seats}</Text>

                        <TouchableOpacity onPress={handleAdd}>
                            <Ionicons name='add-circle-outline' size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Date</Text>
                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setTempDate(selectedDate);
                                }
                            }}
                            minimumDate={new Date()}
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Time</Text>
                        <DateTimePicker
                            value={tempDate}
                            mode="time"
                            display="spinner"
                            is24Hour={true}
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setTempDate(selectedDate);
                                }
                            }}
                        />

                        <Button title="Confirm" onPress={handleConfirm} />
                    </View>
                </View>
            </Modal>

            <View style={styles.button_container}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.button_text}>
                        Find
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default FindRide