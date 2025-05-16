import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './styles';
import { View, Text, TouchableOpacity, Image, Platform, Alert, ActivityIndicator, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import Header from '@/components/Header';
import { addDoc, updateUser, uploadAsset } from '@/apis'; // ✅ Import your uploadAsset API
import { useRouter } from 'expo-router';
import { useAuth } from '../_context/AuthContext';
import OtpModal from '@/components/OtpModal';
import { LeafCircle, ProfileSuccess } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const Kyc = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const styles = getStyles();
    const router = useRouter();
    const { kyc, setKyc, type, user } = useAuth();
    const [front, setFront] = useState<string | null>(null);
    const [back, setBack] = useState<string | null>(null);
    const [uploadingFront, setUploadingFront] = useState(false);
    const [uploadingBack, setUploadingBack] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [open, setOpen] = useState(false);


    const snapPoints = useMemo(() => ['1%', '50%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);


    const pickFront = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: false,
        });

        if (!result.canceled) {
            const pickedImage = result.assets[0];

            const file = {
                uri: Platform.OS === 'ios' ? pickedImage.uri.replace('file://', '') : pickedImage.uri,
                name: pickedImage.fileName || `photo_front_${Date.now()}.jpg`,
                type: pickedImage.type || 'image/jpeg',
            };

            try {
                setUploadingFront(true);
                const response = await uploadAsset([file]);
                console.log('Front image upload ✅', response.data);

                const uploadedUrl = response.data?.data.urls[0];
                if (uploadedUrl) {
                    setFront(uploadedUrl);
                } else {
                    throw new Error('Upload failed: No URL returned.');
                }
            } catch (error) {
                console.error('Front image upload error ❌', error);
                Alert.alert('Upload Error', 'Failed to upload front image.');
            } finally {
                setUploadingFront(false);
            }
        }
    };

    const pickBack = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: false,
        });

        if (!result.canceled) {
            const pickedImage = result.assets[0];

            const file = {
                uri: Platform.OS === 'ios' ? pickedImage.uri.replace('file://', '') : pickedImage.uri,
                name: pickedImage.fileName || `photo_back_${Date.now()}.jpg`,
                type: pickedImage.type || 'image/jpeg',
            };

            try {
                setUploadingBack(true);
                const response = await uploadAsset([file]);
                console.log('Back image upload ✅', response.data);

                const uploadedUrl = response.data?.data.urls[0];
                if (uploadedUrl) {
                    setBack(uploadedUrl);
                } else {
                    throw new Error('Upload failed: No URL returned.');
                }
            } catch (error) {
                console.error('Back image upload error ❌', error);
                Alert.alert('Upload Error', 'Failed to upload back image.');
            } finally {
                setUploadingBack(false);
            }
        }
    };

    const handleSave = async () => {
        if (step === 0) {
            if (!firstName || !lastName || !email || !phone) {
                Alert.alert('Validation Error', 'Please fill the complete form');
                return;
            }
            setStep(1)
        } else {
            if (!front || !back) {
                Alert.alert('Validation Error', 'Please upload both front and back images.');
                return;
            }

            const data = {
                idFrontImage: front,
                idBackImage: back,
                idType: 'id_card'
            };
            let user = {
                givenName: firstName,
                familyName: lastName,
                email: email,
                phoneNumber: phone.replace(/ /g, '')
            }
            try {
                setLoading(true)
                const response = await addDoc(data);
                const userResponse = await updateUser(user);
                console.log(userResponse)
                setLoading(false)
                setKyc({ ...kyc, idDocument: [data] })
                setOpen(true);
            } catch (error: any) {
                setLoading(false)
                console.error('Error submitting document:', JSON.stringify(error.response));
                Alert.alert('Error', 'Failed to submit document. Please try again.');
            }
        }
    };

    useEffect(() => {
        setFirstName(kyc?.givenName)
        setLastName(kyc?.familyName)
        setEmail(kyc?.email)
    }, [])


    const handleSubmit = () => {
        setOpen(false);
        bottomSheetRef.current?.expand();
    }

    const successRoute = () => {
        if (type === 'driver') {
            router.push('/vehiclekyc')
        } else {
            router.push('/(tabs)/home')
        }
    }



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <GestureHandlerRootView style={styles.container}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ flex: 1 }}
                    >
                        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                            <Header title="Lets create your Profile" />
                        </View>

                        <View style={styles.content}>
                            {step === 0 ? (
                                <View style={styles.info_form} >
                                    <Text>We'll walk you through a few simple steps to complete your account.</Text>
                                    <Image
                                        source={{ uri: kyc?.photo }} // Replace with actual user image
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 50,
                                            resizeMode: 'contain',
                                            marginRight: 10
                                        }}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First Name"
                                        placeholderTextColor="#aaa"
                                        keyboardType='ascii-capable'
                                        autoCapitalize="none"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Last Name"
                                        placeholderTextColor="#aaa"
                                        keyboardType='ascii-capable'
                                        autoCapitalize="none"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#aaa"
                                        keyboardType='ascii-capable'
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone"
                                        placeholderTextColor="#aaa"
                                        keyboardType='name-phone-pad'
                                        autoCapitalize="none"
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                    <Text style={{color:theme.color.gray, textAlign:'justify', marginTop:10 , padding:5}} >
                                        <Ionicons name='warning-outline' style={{color:'#FBB473'}} />
                                       {' '} At EcoRydes, your personal information is used solely to operate and enhance the ride-sharing experience. We do not share, disclose, or use your data for any unrelated purposes without your explicit consent.
                                    </Text>
                                </View>
                            ) : ''}
                            {step === 1 ? (
                                <View style={styles.id_form} >
                                    <View style={styles.upload_container}>
                                        <Text style={{ ...styles.label, alignSelf: 'flex-start' }}>ID Card Front</Text>
                                        <TouchableOpacity style={styles.upload_box} onPress={pickFront} disabled={uploadingFront}>
                                            {uploadingFront ? (
                                                <ActivityIndicator size="small" color="#000" />
                                            ) : front ? (
                                                <Image source={{ uri: front }} style={styles.image} />
                                            ) : (
                                                <Text style={styles.label}>Upload or Select Image</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.upload_container}>
                                        <Text style={{ ...styles.label, alignSelf: 'flex-start' }}>ID Card Back</Text>
                                        <TouchableOpacity style={styles.upload_box} onPress={pickBack} disabled={uploadingBack}>
                                            {uploadingBack ? (
                                                <ActivityIndicator size="small" color="#000" />
                                            ) : back ? (
                                                <Image source={{ uri: back }} style={styles.image} />
                                            ) : (
                                                <Text style={styles.label}>Upload or Select Image</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : ''}
                        </View>

                        <View style={styles.button_container}>
                            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={uploadingFront || uploadingBack}>
                                {step === 0 ? (
                                    <Text style={styles.button_text}>
                                        Continue
                                    </Text>
                                ) : ""}
                                {step === 1 ? (
                                    <Text style={styles.button_text}>
                                        {loading ? 'Loading...' : 'Save'}
                                    </Text>
                                ) : ""}
                            </TouchableOpacity>
                        </View>
                        <OtpModal open={open} setOpen={() => null} handleSubmit={handleSubmit} />
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
                                    <Image source={ProfileSuccess} />
                                    <Text style={styles.title_text}>Profile Complete</Text>
                                    <Text style={{ textAlign: 'center' }}>
                                        Welcome to EcoRydes, your identity has been successfully verified. You’re now ready to book rides with all features.
                                    </Text>
                                    <TouchableOpacity
                                        style={{ ...styles.button, width: '90%', marginTop: 10 }}
                                        onPress={successRoute}
                                    >
                                        <Text style={styles.button_text}>Lets Go</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Text style={{ fontWeight: '700' }}>Add more</Text>
                            </TouchableOpacity> */}
                                </View>
                            </BottomSheetView>
                        </BottomSheet>
                    </KeyboardAvoidingView>
                </GestureHandlerRootView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Kyc;
