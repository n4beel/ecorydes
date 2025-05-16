import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Header from '@/components/Header';


const LicenseKyc = () => {
    const styles = getStyles();
    const [front, setFront] = useState<string | null>(null);
    const [back, setBack] = useState<string | null>(null);


    const pickFront = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setFront(result.assets[0].uri);
        }
    };

    const pickBack = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setBack(result.assets[0].uri);
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }} >
                <Header title='Upload you License' />
            </View>
            <View style={styles.content} >
                <View style={styles.upload_container} >
                    <Text style={{ ...styles.label, alignSelf: 'flex-start' }} >
                        License Front
                    </Text>
                    <TouchableOpacity style={styles.upload_box} onPress={pickFront} >
                        {front ? <Image source={{ uri: front }} style={styles.image} /> : <Text style={styles.label}>Upload or Select Image</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.upload_container} >
                    <Text style={{ ...styles.label, alignSelf: 'flex-start' }} >
                        License Back
                    </Text>
                    <TouchableOpacity style={styles.upload_box} onPress={pickBack} >
                        {back ? <Image source={{ uri: back }} style={styles.image} /> : <Text style={styles.label}>Upload or Select Image</Text>}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.button_container}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.button_text}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default LicenseKyc