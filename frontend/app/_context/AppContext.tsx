import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios'; // Assuming axios will be used to fetch rides too
import { getAllRides } from '@/apis';

type Ride = any; // You can define a more specific type later if needed

type AppContextType = {
    filter: any;
    setFilter: (filter: any) => void;
    rideList: Ride[];
    totalRides: number;
    page: number;
    total: number;
    fetchRides: () => Promise<void>;
    increasePage: () => void;
    loadingRides: boolean;
    rideDetail: any | null;
    handleRideDetail: (ride: any) => void;
    handleReset:()=>void;
};

const AppContext = createContext<AppContextType>({
    filter: null,
    setFilter: () => { },
    rideList: [],
    totalRides: 0,
    page: 1,
    total: 0,
    fetchRides: async () => { },
    increasePage: () => { },
    loadingRides: false,
    rideDetail: null,
    handleRideDetail: (ride: any) => { },
    handleReset:()=>{}
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [filter, setFilter] = useState<any>(null);
    const [rideList, setRideList] = useState<Ride[]>([]);
    const [totalRides, setTotalRides] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState(0);
    const [loadingRides, setLoadingRides] = useState<boolean>(false);
    const [rideDetail, setRideDetail] = useState(null);

    const fetchRides = async () => {
        setLoadingRides(true);
        try {
            // setRideList([])
            let startLocationLat = filter.startLocation.latitude
            let startLocationLng = filter.startLocation.longitude
            let endLocationLat = filter.endLocation.latitude
            let endLocationLng = filter.endLocation.longitude
            const response = await getAllRides(page, startLocationLat, startLocationLng, endLocationLat, endLocationLng);
            // console.log(response.data)
            setRideList([...rideList, ...response.data?.data?.data]);
            setTotal(response.data?.data?.totalPages)
            setLoadingRides(false);
        } catch (error) {
            console.log('Failed to fetch rides:', error);
        } finally {
            setLoadingRides(false);
        }
    };

    const handleRideDetail = (ride: any) => {
        setRideDetail(ride);
    }

    const increasePage = () => {
        if (page < total) {
            setPage(prev => prev + 1);
        }
    };

    const handleReset = ()=>{
        setTotal(0);
        setPage(1);
        setRideList([]);
    }

    return (
        <AppContext.Provider value={{
            filter,
            setFilter,
            rideList,
            totalRides,
            page,
            fetchRides,
            increasePage,
            loadingRides,
            rideDetail,
            handleRideDetail,
            handleReset,
            total,
        }}>
            {children}
        </AppContext.Provider>
    );
};
