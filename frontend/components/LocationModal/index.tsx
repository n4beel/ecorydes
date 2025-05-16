import { Location as LocationImage } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import * as Location from 'expo-location';

interface LocationModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    handleSubmit:(loc:any)=>void;
}

const LocationModal: React.FC<LocationModalProps> = ({ open, setOpen , handleSubmit}) => {

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      handleSubmit(location);

    };
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
                }}>
                    <View style={{ paddingBottom: 20, height: 600, alignItems: 'center', justifyContent: 'space-between' }} >
                        <View>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Enable Your Location</Text>
                                {/* <TouchableOpacity>
                                    <Ionicons name='close-outline' size={30}/>
                                </TouchableOpacity> */}
                            </View>
                            <Text style={{ fontSize: 12, color: theme.color.dark }} >
                                Choose your location to start find the request around you.
                            </Text>
                        </View>
                        <Image source={LocationImage} style={{ width: 300, height: 200 }} />
                        <TouchableOpacity style={{
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
                            onPress={getCurrentLocation}
                        >
                            <Text style={{
                                fontSize: 14,
                                color: theme.color.dark,
                                fontWeight: 400,
                                fontFamily: 'Sora'
                            }}>
                                Use My Location
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default LocationModal;