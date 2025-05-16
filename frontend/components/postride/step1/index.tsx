import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import { getStyles } from './styles';
import { Reverse } from '@/assets';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const GOOGLE_API_KEY = 'AIzaSyC_qENeuRAe_Weq0xdxyAuJoCIJnooKcaw'; // Replace with your own key

// Define LocationData with lat and lng as number | null
type LocationData = {
  address: string;
  latitude: number;
  longitude: number;
};


interface Step1Props {
  pickup: LocationData;
  setPickup: (value: LocationData) => void;
  dropoff: LocationData;
  setDropoff: (value: LocationData) => void;
}

const Step1 = ({ pickup, setPickup, dropoff, setDropoff }: Step1Props) => {
  const styles = getStyles();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | number | null>(null);

  const contentRef = useRef<View>(null);

  const fetchSuggestions = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&components=country:pk&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.result) {
        return {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng,
        };
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
    return null;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeField === 'pickup') {

        fetchSuggestions(pickup.address);
      } else if (activeField === 'dropoff') {
        fetchSuggestions(dropoff.address);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [pickup.address, dropoff.address, activeField]);

  const handleSuggestionPress = async (description: string, placeId: string) => {
    const location = await fetchPlaceDetails(placeId);

    if (activeField === 'pickup') {
      setPickup({ address: description, latitude: location?.lat, longitude: location?.lng });
    } else if (activeField === 'dropoff') {
      setDropoff({ address: description, latitude: location?.lat, longitude: location?.lng });
    }
    setSuggestions([]);
    setActiveField(null);
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container} ref={contentRef}>
        <View style={styles.content}>
          <View style={styles.section}>

            {/* Pickup input */}
            <View style={{ position: 'relative', zIndex: activeField === 'pickup' ? 99 : 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Pickup"
                placeholderTextColor="#aaa"
                keyboardType="ascii-capable"
                autoCapitalize="none"
                value={pickup.address}
                onFocus={() => setActiveField('pickup')}
                onChangeText={(text) => {
                  setPickup({ address: text, latitude: 0, longitude: 0 });
                  setActiveField('pickup');
                }}
              />
              {(loading || suggestions.length > 0) && activeField === 'pickup' && (
                <View style={styles.suggestionsContainer}>
                  {loading ? (
                    <ActivityIndicator size="small" color={theme.color.primary} />
                  ) : (
                    <ScrollView keyboardShouldPersistTaps="handled">
                      {suggestions.map((item) => (
                        <TouchableOpacity
                          key={item.place_id}
                          style={styles.suggestionItem}
                          onPress={() => handleSuggestionPress(item.description, item.place_id)}
                        >
                          <View style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: theme.color.light_gray, alignItems: 'center', justifyContent: 'center' }} >
                            <Ionicons name='location-outline' size={15} />
                          </View>
                          <Text>{item.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* Reverse Button */}
            <TouchableOpacity style={styles.reverse}>
              <Image source={Reverse} />
            </TouchableOpacity>

            {/* Dropoff input */}
            <View style={{ position: 'relative', zIndex: activeField === 'dropoff' ? 99 : 1, marginTop: 20 }}>
              <TextInput
                style={styles.input}
                placeholder="Dropoff"
                placeholderTextColor="#aaa"
                keyboardType="ascii-capable"
                autoCapitalize="none"
                value={dropoff.address}
                onFocus={() => setActiveField('dropoff')}
                onChangeText={(text) => {
                  setDropoff({ address: text, latitude: 0, longitude: 0 });
                  setActiveField('dropoff');
                }}
              />
              {(loading || suggestions.length > 0) && activeField === 'dropoff' && (
                <View style={styles.suggestionsContainer}>
                  {loading ? (
                    <ActivityIndicator size="small" color={theme.color.primary} />
                  ) : (
                    <ScrollView keyboardShouldPersistTaps="handled">
                      {suggestions.map((item) => (
                        <TouchableOpacity
                          key={item.place_id}
                          style={styles.suggestionItem}
                          onPress={() => handleSuggestionPress(item.description, item.place_id)}
                        >
                          <Text>{item.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

          </View>
        </View>
      </View>
    </View>
  );
};

export default Step1;
