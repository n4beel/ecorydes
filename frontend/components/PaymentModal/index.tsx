import { Location as LocationImage, LogoWithLeaf } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { getStyles } from './styles';

interface PaymentModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    handleSubmit: () => void;
    pickup: string;
    dropoff: string;
    balance: number;
    cost:number
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, setOpen, handleSubmit, pickup, dropoff, balance, cost }) => {
    const styles = getStyles();
    const [select, setSelect] = useState(false);
 
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={() => setOpen(false)}
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
                    height: 800
                }}>
                    <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=>setOpen(false)}>
                        <Ionicons name='close-outline' size={25} />
                    </TouchableOpacity>
                    <View style={styles.stops_container} >
                        <View style={styles.stop_item}>
                            <View style={styles.location_wrapper} >
                                <Ionicons name="location" size={18} color={theme.color.dark} />
                            </View>
                            <Text style={styles.stopLabel}>Pickup :</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stopAddress}>
                                    {pickup}
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
                                    {dropoff}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }} >
                        <Image source={LogoWithLeaf} />
                    </View>
                    <View>
                        <View style={{ backgroundColor: theme.color.primary, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} >
                                <Ionicons name='wallet-outline' size={30} />
                                <Text style={{ fontSize: 15, fontWeight: 700 }} >
                                    Wallet Balance
                                </Text>
                            </View>
                            <Text style={{ fontSize: 15, fontWeight: 700 }} >
                                ${balance ? balance : '0'}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: theme.color.light_gray, marginTop: 10, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 10, }} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                <Text style={{ fontSize: 12, color: theme.color.dark }} >
                                     Subtotal 
                                </Text>
                                <Text style={{ fontSize: 12, color: theme.color.dark }} >
                                    ${cost}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }} >
                                <Text style={{ fontSize: 12, color: theme.color.dark }} >
                                    Platform fees
                                </Text>
                                <Text style={{ fontSize: 12, color: theme.color.dark }} >
                                    $0.00
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }} >
                                <Text style={{ fontSize: 12, color: theme.color.dark, fontWeight: 700 }}>
                                    To Pay
                                </Text>
                                <Text style={{ fontSize: 12, color: theme.color.dark, fontWeight: 700 }}>
                                    ${cost}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 30 }} >
                        <TouchableOpacity onPress={() => setSelect(!select)} style={{ alignItems: 'center', justifyContent: 'center', width: 20, height: 20, backgroundColor: select ? theme.color.primary : theme.color.gray, borderRadius: 5, marginTop: 5 }} >
                            {select ? <Ionicons name='checkmark-outline' /> : ''}
                        </TouchableOpacity>
                        <Text>
                            I consent to these guidelines, the Driver
                            Cancellation Policy, Rider Cancellation Policy, Terms and condition and Privacy Policy.
                        </Text>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            right: 0,
                            left: 0,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity style={{
                            width: '90%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 55,
                            backgroundColor: theme.color.dark,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                        }}
                            onPress={handleSubmit}
                        >
                            <Text style={{
                                fontSize: 14,
                                color: theme.color.white,
                                fontWeight: 400,
                                fontFamily: 'Sora'
                            }}>
                                {cost>balance ? 'Add funds to wallet':'Pay Now'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default PaymentModal;