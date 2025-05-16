import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getStyles } from './styles';
import { useRouter } from 'expo-router';
import Created from '@/components/myrides/created';
import Requested from '@/components/myrides/requested';

const MyRides = () => {
  const styles = getStyles();
  const router = useRouter();
  const [isdriver, setDriver] = useState(true);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.section}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, isdriver === true && styles.activeTab]}
            onPress={() => setDriver(true)}
          >
            <Text style={styles.tabText}>Driver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isdriver === false && styles.activeTab]}
            onPress={() => setDriver(false)}
          >
            <Text style={styles.tabText}>Passenger</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content} >
        {isdriver ? (
          <Created />
        ) : (
          <Requested />
        )}
      </View>
    </SafeAreaView>
  )
}

export default MyRides;