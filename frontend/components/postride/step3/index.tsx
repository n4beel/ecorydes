import Header from '@/components/Header'
import React from 'react'
import { View, Text, TextInput, Image } from 'react-native'
import { getStyles } from './styles'
import { Leaf, Reverse } from '@/assets'

const Step3: React.FC<any> = ({ cost, setCost }) => {
    const styles = getStyles();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={{ ...styles.text }}>Pricing</Text>
                    <Text style={{ marginTop: 10 }} >
                        Specify a reasonable cost per seat covering gas and additional expenses.
                    </Text>
                </View>
                <Image source={Leaf} style={{ marginVertical: 20 }} />
                <View style={styles.section}>
                    <Text style={{ ...styles.text }}>
                        Price per seat (Recommended)
                    </Text>
                    <Text style={{ marginTop: 10 }} >
                        This pricing strategy ensures a competitive trip, maximizing your opportunities for passenger bookings.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="$30"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        value={cost}
                        onChangeText={(text) => setCost(text)}
                    />
                </View>
            </View>
        </View>
    )
}

export default Step3