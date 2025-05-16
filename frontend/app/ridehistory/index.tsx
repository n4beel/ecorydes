import Header from '@/components/Header'
import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import theme from '@/constants/theme'

const RideHistory = () => {
    const styles = getStyles();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Ride History" />
            </View>
            <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                {Array(10).fill(0).map((_, i) => {
                    let greenorred = i % 2 === 0;
                    return (
                        <TouchableOpacity key={i} style={{ ...styles.card, backgroundColor: greenorred ? theme.color.lightgreen : theme.color.mid_red }}>
                            <View style={{ position: 'absolute', right:10, top:10, backgroundColor: greenorred ? theme.color.mid_green:theme.color.light_red, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }} >
                                <Text style={{fontSize:8, color:theme.color.dark}} >
                                    {greenorred ? 'Complete':'Incomplete'}
                                </Text>
                            </View>
                            <View style={{...styles.cardHeader , marginTop:30}}>
                                <View style={{ alignItems: 'center' }} >
                                    <Image
                                        source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.rating_container} >
                                        <Ionicons name="star" size={12} color={theme.color.golden} />
                                        <Text style={styles.rating}>4.3</Text>
                                    </View>

                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.name}>Sam Alexander</Text>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar" size={14} color="black" />
                                        <Text style={styles.text_sm}>23 Jan 2023</Text>
                                        <Ionicons name="time" size={14} color="black" />
                                        <Text style={styles.text_sm}>6:30pm</Text>
                                        <Ionicons name="car" size={14} color="black" />
                                        <Text style={styles.text_sm}>3 Seats</Text>
                                    </View>
                                </View>
                                <View style={{...styles.priceBox , backgroundColor:greenorred ? theme.color.mid_green:theme.color.light_red}}>
                                    <Text style={styles.price}>$8</Text>
                                </View>
                            </View>
                            <View style={styles.line} />
                            <View style={styles.routeSection}>
                                <Ionicons name="location" size={18} color={theme.color.dark} />
                                <Text style={styles.routeText}>Frere Hall, Fatima Jinnah Rd, Saddar</Text>
                            </View>
                            <View style={styles.routeSection}>
                                <Ionicons name="ellipse" size={15} color={theme.color.primary} />
                                <Text style={styles.routeText}>Block 9 Gulshan-e-Iqbal, Karachi</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

export default RideHistory