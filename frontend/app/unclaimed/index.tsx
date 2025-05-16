import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import theme from '@/constants/theme'
import { claimFare, claimRyd, getUnclaimedRides } from '@/apis'
import { format } from 'date-fns'
import { useAuth } from '../_context/AuthContext'

const Unclaimed = () => {
    const styles = getStyles();
    const router = useRouter();
    const { kyc } = useAuth();
    const [loading, setLoading] = useState(false);
    const [rides, setRides] = useState<any>(null)

    const getUnclaimed = async () => {
        try {
            setLoading(true);
            let response = await getUnclaimedRides();
            setRides(response.data?.data?.data);
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUnclaimed();
    }, [])

    const claimryd = async (id: string) => {
        try {
            setLoading(true);
            let response = await claimRyd(id, kyc?.publicKey);
            if (response.data) {
                router.push('/wallet')
            }
            setLoading(false);
        } catch (e: any) {
                            router.push('/wallet')
            console.log(e)
            setLoading(false);
        }
    }


    const claimfare = async (id: string) => {
        try {
            setLoading(true);
            let response = await claimFare(id, kyc?.publicKey);
            if (response.data) {
                router.push('/wallet')
            }
            setLoading(false);
        } catch (e: any) {
                            router.push('/wallet')
            console.log(e)
            setLoading(false);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Unclaimed Rewards" />
            </View>
            <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                {loading && <ActivityIndicator />}
                {rides && rides.length && rides.map((r: any, i: number) => {
                    return (
                        <TouchableOpacity key={i} style={{ ...styles.card, backgroundColor: r?.status === 'completed' ? theme.color.lightgreen : theme.color.mid_red }}>
                            <View style={{ position: 'absolute', right: 10, top: 10, backgroundColor: r?.status ? theme.color.mid_green : theme.color.light_red, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }} >
                                <Text style={{ fontSize: 8, color: theme.color.dark }} >
                                    {r.status}
                                </Text>
                            </View>
                            <View style={{ ...styles.cardHeader, marginTop: 30 }}>
                                <View style={{ alignItems: 'center' }} >
                                    <Image
                                        source={{ uri: r?.userId?.photo }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.rating_container} >
                                        {/* <Ionicons name="star" size={12} color={theme.color.golden} /> */}
                                    </View>

                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.name}>{r?.userId?.givenName} {r?.userId?.familyName}</Text>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar" size={14} color="black" />
                                        <Text style={styles.text_sm}>{format(r?.startTime, 'dd MMM yyyy')}</Text>
                                        <Ionicons name="time" size={14} color="black" />
                                        <Text style={styles.text_sm}>{format(r?.startTime, 'hh:mm a')}</Text>
                                        <Ionicons name="car" size={14} color="black" />
                                        <Text style={styles.text_sm}>{r?.seats} Seats</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.priceBox, backgroundColor: r.status === 'completed' ? theme.color.mid_green : theme.color.light_red }}>
                                    <Text style={styles.price}>${r?.cost}</Text>
                                </View>
                            </View>
                            <View style={styles.line} />
                            <View style={styles.routeSection}>
                                <Ionicons name="location" size={18} color={theme.color.dark} />
                                <Text style={{ ...styles.routeText, paddingRight: 10 }}>
                                    {r?.startLocation?.address}
                                </Text>
                            </View>

                            <View style={styles.routeSection}>
                                <Ionicons name="ellipse" size={15} color={theme.color.primary} />
                                <Text style={{ ...styles.routeText, paddingRight: 10 }}>
                                    {r?.endLocation?.address}
                                </Text>
                            </View>

                            <View style={{ gap: 15, alignItems: 'center', marginTop: 20 }} >
                                {!r?.creditsCollected && (
                                    <TouchableOpacity style={{
                                        ...styles.button,
                                        backgroundColor: 'transparent',
                                        borderWidth: 1,
                                        borderColor: theme.color.dark,
                                    }}
                                        onPress={() => {
                                            claimfare(r._id)
                                             claimryd(r?._id)
                                        }}
                                    >
                                        <Text style={{ ...styles.button_text, color: theme.color.dark }}>
                                            {loading ? <ActivityIndicator /> : 'Claim $RYD & Fare'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {/* {!r?.farePaid && (
                                    <TouchableOpacity style={styles.button} onPress={() => claimfare(r._id)}>
                                        <Text style={styles.button_text}>
                                            {loading ? <ActivityIndicator /> : 'Claim Fare'}
                                        </Text>
                                    </TouchableOpacity>
                                )} */}
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Unclaimed