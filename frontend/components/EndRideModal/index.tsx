import { getRyd } from '@/apis';
import { useAuth } from '@/app/_context/AuthContext';
import { Location as LocationImage, LogoWithLeaf, SuccessTick } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

interface EndrideModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    cost: number;
    pickup: string;
    dropoff: string;
    id: string;
}

const EndrideModal: React.FC<EndrideModalProps> = ({ open, setOpen, cost, pickup, dropoff, id }) => {
    const { user } = useAuth();
    const [ryd, setRyd] = useState('')


    const router = useRouter()

    const getToken = async () => {
        try {
            let response = await getRyd(id);
            setRyd(response?.data?.data?.credits)
        } catch (e) {
            Alert.alert('Error', 'Failed to fetch ryd.');
        }
    }
    useEffect(() => {
        getToken()
    }, [])

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
                    <View style={{ alignItems: 'center', marginVertical: 20 }} >
                        <Image source={LogoWithLeaf} style={{ width: 100, height: 100 }} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 700 }} >
                            {user?.givenName}, Thanks for using EcoRydes
                        </Text>
                        <Text style={{ fontSize: 14, marginTop: 10 }} >
                            We hope you enjoyed your ride, thanks for saving the planet 🌎
                        </Text>
                            <Text style={{ fontSize: 14, marginTop: 10 }} >
                                You have earned {ryd} $RYD tokens. You will be able to claim once the journey is complete.
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 30 }} >
                        <Text style={{ fontSize: 14, fontWeight: 700 }} >Total Fare</Text>
                        <View style={{
                            backgroundColor: theme.color.primary,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: theme.color.dark,
                                fontFamily: 'Sora',
                                fontWeight: 700
                            }}>$ {cost}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 10,
                            marginTop: 10,
                        }}>
                            <Ionicons name="location" size={18} color={theme.color.dark} style={{ marginTop: 10 }} />
                            <Text style={{
                                fontSize: 11,
                                color: theme.color.dark,
                                fontFamily: 'Sora',
                                paddingRight: 10
                            }}>
                                {pickup}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 10,
                            marginTop: 10,
                        }}>
                            <Ionicons name="ellipse" size={15} color={theme.color.primary} />
                            <Text style={{
                                fontSize: 11,
                                color: theme.color.dark,
                                fontFamily: 'Sora',
                                paddingRight: 10
                            }}>
                                {dropoff}
                            </Text>
                        </View>
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

                            onPress={() => {
                                setOpen(false)
                                router.push('/wallet')
                            }}

                        >
                            <Text style={{
                                fontSize: 14,
                                color: theme.color.white,
                                fontWeight: 400,
                                fontFamily: 'Sora'
                            }}>
                                Go to your wallet
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default EndrideModal;