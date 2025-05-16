import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeStep1, WelcomeStep2, WelcomeStep3 } from '../../assets';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../_context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';
import LocationModal from '@/components/LocationModal';
import * as Location from 'expo-location';


const steps = [
  {
    image: WelcomeStep1,
    title: 'Welcome aboard, hero!',
    description:
      'EcoRydes lets you share rides with ease, pay or get paid in crypto, and take a step toward a cleaner planet.',
  },
  {
    image: WelcomeStep2,
    title: 'Rethink Ridesharing. Ride Eco. Pay Crypto.',
    description:
      `Seamlessly share rides, reduce your carbon footprint, and pay or earn using crypto. Whether you're a driver or a rider, Ecorydes connects you with eco-conscious communities and lets you move smarter`,
  },
  {
    image: WelcomeStep3,
    title: 'How It Works',
    description: "",
  },
];

const step3 = [
  {
    title: 'Find or Offer a Ride',
    description: `Connect with people heading your way.`
  },
  {
    title: 'Eco-Friendly Routes',
    description: `We optimize carpooling to minimize emissions.`
  },
  {
    title: 'Pay or Get Paid in Crypto',
    description: `fast, secure, and borderless payments.`,
  },
];


const Welcome = () => {
  const { user } = useAuth();
  const styles = getStyles();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to the next screen after onboarding (example: login or home)
      // router.replace('/prefrence'); // Change this to your actual route
      setOpen(true)
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (loc: any) => {
    if (loc) {
      setOpen(false);
      router.push('/setup'); // Change this to your actual route
    } else {
      Alert.alert("Error", "Add Location")
    }
  }


  const step = steps[currentStep];

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.image_container} >
        <Image source={step.image} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.stepText} >
          {currentStep + 1} / 3
        </Text>
        <Text style={styles.titleText}>{step.title}</Text>
        {currentStep === 2 ? "" : (
          <Text style={styles.text}>{step.description}</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 10
          }}
        >
          {currentStep === 2 && step3.map((s, index) => (
            <View
              key={index}
              style={{
                flexBasis: '30%', // roughly 3 in a row
              }}
            >
              <View style={{ width: 30, height: 30, borderRadius: 50, marginBottom: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.color.lightgreen }} >
                <Text style={{ fontSize: 11 }} >
                  {index + 1}
                </Text>
              </View>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{s.title}</Text>
              <Text style={{ fontSize: 11, marginTop: 8 }}>{s.description}</Text>
            </View>
          ))}
        </View>

      </View>
      <View style={styles.step_container} >
        <TouchableOpacity style={styles.back} onPress={handleBack}>
          <Ionicons name='chevron-back-outline' size={25} />
        </TouchableOpacity>
        <View style={styles.lines_container} >
          <View style={currentStep === 0 ? styles.line_active : styles.line} ></View>
          <View style={currentStep === 1 ? styles.line_active : styles.line} ></View>
          <View style={currentStep === 2 ? styles.line_active : styles.line} ></View>
        </View>
        <TouchableOpacity style={styles.forward} onPress={handleNext} >
          <Ionicons name='chevron-forward-outline' size={25} />
        </TouchableOpacity>
      </View>
      <LocationModal open={open} setOpen={setOpen} handleSubmit={(loc: any) => handleSubmit(loc)} />
    </View>
    // </SafeAreaView>
  );
};

export default Welcome;