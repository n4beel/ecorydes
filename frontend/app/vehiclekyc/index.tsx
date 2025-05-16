import React, { useCallback, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStyles } from './styles';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import Header from '@/components/Header';
import { addDoc, addVehicle, uploadAsset } from '@/apis'; // ✅ import your API
import { useRouter } from 'expo-router';
import { useAuth } from '../_context/AuthContext';
import { ProfileSuccess, RightImage, WrongImage } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const VehicleKyc = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const styles = getStyles();
    const router = useRouter();
    const { setKyc, kyc } = useAuth();

    const [front, setFront] = useState<string | null>(null);
    const [back, setBack] = useState<string | null>(null);
    const [uploadingFront, setUploadingFront] = useState(false);
    const [uploadingBack, setUploadingBack] = useState(false);

    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [registration, setRegistration] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);



    const snapPoints = useMemo(() => ['1%', '50%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);



    const pickImage = async () => {
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
                name: pickedImage.fileName || `photo_${Date.now()}.jpg`,
                type: pickedImage.type || 'image/jpeg',
            };

            try {
                setUploading(true);
                const response = await uploadAsset([file]);
                console.log('Upload Image........... ✅', response.data);

                const uploadedUrl = response.data?.data.urls[0]; // depends on your backend structure!
                if (uploadedUrl) {
                    setImageUri(uploadedUrl);
                    // Alert.alert('Success', 'Image uploaded successfully.');
                } else {
                    throw new Error('Upload failed: No URL returned.');
                }
            } catch (error) {
                console.error('Upload error ❌', error);
                Alert.alert('Upload Error', 'Failed to upload image.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSave = async () => {
        if (!make.trim()) {
            Alert.alert('Validation Error', 'Please enter vehicle make.');
            return;
        }
        if (!model.trim()) {
            Alert.alert('Validation Error', 'Please enter vehicle model.');
            return;
        }
        if (!color.trim()) {
            Alert.alert('Validation Error', 'Please enter vehicle color.');
            return;
        }
        if (!registration.trim()) {
            Alert.alert('Validation Error', 'Please enter vehicle registration number.');
            return;
        }
        if (!imageUri) {
            Alert.alert('Validation Error', 'Please upload an image.');
            return;
        }
        if (step === 0) {
            setStep(1)
        } else {
            if (!front || !back) {
                Alert.alert('Validation Error', 'Please upload both front and back images.');
                return;
            }
            const iddata = {
                idFrontImage: front,
                idBackImage: back,
                idType: 'driver_license'
            };
            const data = {
                make,
                model,
                color,
                registration,
                image: imageUri,
            };
            try {
                setLoading(true)
                const idresponse = await addDoc(iddata);
                const response = await addVehicle(data);
                setLoading(false)
                setKyc({ ...kyc, vehicles: [data] })
                bottomSheetRef.current?.expand();
            } catch (error) {
                setLoading(false)
                console.error('Error adding vehicle:', error);
                Alert.alert('Error', 'Failed to add vehicle. Please try again.');
            }
        }
    };


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


    const successRoute = () => {

        router.push('/(tabs)/home')
    }

    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                    <Header title='Upload Vehicle Details' />
                </View>
                {step === 1 ? (
                    <View style={styles.id_form} >
                        <View style={styles.upload_container}>
                            <Text style={{ ...styles.label, alignSelf: 'flex-start' }}>License Front</Text>
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
                            <Text style={{ ...styles.label, alignSelf: 'flex-start' }}>License Back</Text>
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
                {step === 0 ? (
                    <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                        <Text style={styles.text}>Make</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Make"
                            placeholderTextColor="#aaa"
                            value={make}
                            onChangeText={setMake}
                            keyboardType="ascii-capable"
                            autoCapitalize="none"
                        />

                        <Text style={styles.text}>Model</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Model"
                            placeholderTextColor="#aaa"
                            value={model}
                            onChangeText={setModel}
                            keyboardType="ascii-capable"
                            autoCapitalize="none"
                        />

                        <Text style={styles.text}>Color</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Color"
                            placeholderTextColor="#aaa"
                            value={color}
                            onChangeText={setColor}
                            keyboardType="ascii-capable"
                            autoCapitalize="none"
                        />

                        <Text style={styles.text}>Registration #</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Registration #"
                            placeholderTextColor="#aaa"
                            value={registration}
                            onChangeText={setRegistration}
                            keyboardType="ascii-capable"
                            autoCapitalize="none"
                        />

                        <View style={styles.upload_container}>
                            <Text style={styles.text}>Image</Text>
                            <TouchableOpacity style={styles.upload_box} onPress={pickImage} disabled={uploading}>
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.image} />
                                ) : (
                                    <Text style={styles.label}>Upload or Select Image</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: theme.color.light_gray, paddingVertical: 30, paddingHorizontal: 10, marginTop: 10 }}>
                            <Text style={{ marginBottom: 10 }} >
                                Upload a Clear Front Photo of Your Vehicle
                            </Text>
                            <Text style={{ marginBottom: 5 }} >
                                {'\u2022' + '  '} The entire front of the vehicle is visible
                            </Text>
                            <Text style={{ marginBottom: 5 }} >
                                {'\u2022' + '  '} The image is taken in good lighting
                            </Text>
                            <Text style={{ marginBottom: 5 }} >
                                {'\u2022' + ' '}   The license plate is clearly readable
                            </Text>
                            <Text style={{ marginBottom: 5 }} >
                                {'\u2022' + ' '}   No filters or obstructions
                            </Text>
                            <Text style={{ marginTop: 5 }} >
                                Example of Photo
                            </Text>
                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 , position:'relative'}} >
                                <View style={{position:'relative'}} >
                                    <View style={{position:'absolute', zIndex:100, right:0, top:-4, backgroundColor:theme.color.lightgreen , width:20, height:20 , borderRadius:50, alignItems:'center', justifyContent:'center'}} >
                                        <Ionicons name='checkmark-outline' />
                                    </View>
                                    <Image source={RightImage} />
                                </View>
                                <View style={{position:'relative'}} >
                                    <View style={{position:'absolute', zIndex:100, right:0, top:-4, backgroundColor:theme.color.light_red , width:20, height:20 , borderRadius:50, alignItems:'center', justifyContent:'center'}} >
                                        <Ionicons name='close-outline' />
                                    </View>
                                    <Image source={WrongImage} />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingBottom: 100 }} />
                    </ScrollView>
                ) : ''}

                <View style={styles.button_container}>
                    <TouchableOpacity style={styles.button} onPress={handleSave} disabled={uploading || loading}>
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
                            <Text style={styles.title_text}>Vehicle Registered</Text>
                            <Text style={{ textAlign: 'center' }}>
                                Welcome to EcoRydes, your Vehicle registration has been successfully verified. You’re now ready to offer rides with all features.
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
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default VehicleKyc;
