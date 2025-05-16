import theme from '@/constants/theme';
import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { OtpInput } from "react-native-otp-entry";

interface OtpModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    handleSubmit: (loc: any) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ open, setOpen, handleSubmit }) => {
    const code = "2752";
    const [otp, setOtp] = useState('')

    const handleVerify = () => {
        if (otp !== code) {
            Alert.alert('Error', 'Invalid code');
            return
        }
        handleSubmit("done")
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={() => setOpen(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

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
                                <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }} >Phone verification</Text>
                                <OtpInput
                                    focusColor={theme.color.primary}
                                    numberOfDigits={4}
                                    onTextChange={(text) => setOtp(text)}
                                    theme={{
                                        pinCodeContainerStyle: { width: 70 },
                                    }}
                                />
                                <Text style={{ fontSize: 11, fontWeight: 400, marginTop: 20 }} >
                                    Use test otp 2752 to verify your phone.
                                </Text>
                            </View>
                            <TouchableOpacity style={{
                                width: '98%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 55,
                                backgroundColor: theme.color.dark,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                            }}
                                onPress={handleVerify}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: theme.color.white,
                                        fontWeight: 400,
                                        fontFamily: 'Sora'
                                    }}
                                >Verify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default OtpModal;