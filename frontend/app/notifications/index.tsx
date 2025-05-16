import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text } from 'react-native';
import { getStyles } from './styles';
import Header from '@/components/Header';

const Notifications = () => {
    const styles = getStyles();

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                <Header title="Notifications" />
            </View>
            <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
                {Array(10).fill(0).map((n, i) => {
                    return (
                        <View style={styles.notification_container} key={i}>
                            <Text style={styles.title_text} >
                                 <View style={styles.dot} ></View>
                                 {' '}{' '}
                                 Ride Alert Created Successfully </Text>
                            <Text style={styles.text} >Great ! We'll notify you as soon as a driver heading in the same direction </Text>
                        </View>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Notifications