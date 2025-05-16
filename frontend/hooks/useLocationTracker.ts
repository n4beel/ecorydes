// hooks/useLocationTracker.ts

import * as Location from 'expo-location';
import { useRef, useState } from 'react';

export interface UserLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
}

export const useLocationTracker = () => {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
    let interval: NodeJS.Timeout | undefined;

    const startTracking = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        interval = setInterval(() => { 
            Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            }).then((loc) => {
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    timestamp: loc.timestamp,
                });
            })
        }, 1000)
    };

    const stopTracking = () => {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    };

    return { location, errorMsg, startTracking, stopTracking };
};
