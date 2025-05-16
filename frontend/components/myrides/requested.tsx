import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getRidesByPassenger } from '@/apis'; // adjust the import according to your project structure
import { getStyles } from './styles'; // assuming you have the same styles
import theme from '@/constants/theme';
import { MyRidesDriver } from '@/assets';

const Requested = () => {
    const styles = getStyles();
    const router = useRouter();

    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchRides = async () => {
        try {
            setLoading(true);
            const response = await getRidesByPassenger(page);
            const { data } = response;
            console.log(JSON.stringify(data))
            setRides(prev => [...prev, ...data?.data?.data]); // Append new rides
            setTotalPages(data?.data?.totalPages || 1); // Assuming your backend returns `totalPages`
        } catch (error) {
            console.error('Error fetching rides', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (ride: any) => {
        // You can navigate and pass ride data if needed
        router.push({
            pathname: '/myridedetails/[id]',
            params: {
                id: ride?._id,
            },
        });
    };

    useEffect(() => {
        fetchRides();
    }, [page]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <View style={{ width: '100%', paddingBottom: 30 }} >
            <ScrollView style={{ width: '100%', marginTop: 10 }}>
                {loading && <ActivityIndicator />}
                {rides.length > 0 ? rides.map((ride, i) => {
                    const dateObj = new Date(ride?.startTime);
                    const s_date = dateObj.toISOString().split('T')[0];
                    const s_time = dateObj.toISOString().split('T')[1].slice(0, 5);

                    return (
                        <TouchableOpacity key={i} style={styles.card} onPress={() => handleNavigate(ride)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }} >
                                <View style={{ borderRadius: 15, backgroundColor: theme.color.primary, paddingVertical: 6, paddingHorizontal: 10 }} >
                                    <Text style={{ fontSize: 11 }} >Confirmed</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text style={{ fontSize: 8, marginRight: 5 }}>Companions</Text>
                                    {[...Array(ride.seats - ride.passengers.length).fill({}), ...ride.passengers].map((p: any, i: number) => {
                                        if (Object.keys(p).length) {
                                            return (
                                                <Image
                                                    key={i}
                                                    source={{ uri: p?.passengerId?.photo || 'https://via.placeholder.com/25' }}
                                                    style={{ width: 25, height: 25, borderRadius: 50, opacity: p?.passengerId?.photo ? 1 : 0.3 }}
                                                />
                                            )
                                        }
                                        return (
                                            <View key={i} style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: theme.color.light_gray, alignItems: 'center', justifyContent: 'center' }} >
                                                <Ionicons name='person-outline' />
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.cardHeader}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: ride?.userId?.photo }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.rating_container}>
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
                    );
                }) : (
                    !loading && (
                        <View style={{ height: 700, alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={MyRidesDriver} />
                            <Text style={{ marginTop: 10 }} >You have no passenger requestes.</Text>
                        </View>
                    )
                )}
                {/* Load More Button */}
                {page < totalPages && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={handleLoadMore}>
                            <Text style={{ color: theme.color.blue }}>Load More</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>

    );
};

export default Requested;
