import axios from "axios";

const BASE_URL = 'https://carpool-app-backend-production.up.railway.app';

// Social login
export const signuplogin = (data: any) => {
    return axios.post(`${BASE_URL}/auth/social-login`, data);
};

// Get KYC status
export const getkycStatus = () => {
    return axios.get(`${BASE_URL}/user/me`);
};

// Upload Media Files
export const uploadAsset = (files: { uri: string; name: string; type: string }[]) => {
    const formData = new FormData();

    files.forEach((file, index) => {
        formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any); // `as any` because React Native FormData type can complain
    });

    return axios.post(`${BASE_URL}/media`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};



export const addVehicle = (vehicleData: any) => {
    return axios.post(`${BASE_URL}/vehicle`, vehicleData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



export const addDoc = (data: any) => {
    return axios.patch(`${BASE_URL}/user/id`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



export const postRide = (data: any) => {
    return axios.post(`${BASE_URL}/ride-request`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



export const getAllRides = (page: number, start_lat: any, start_lng: any, end_lat: any, end_lng: any) => {
    console.log(page, "..........")
    return axios.get(`${BASE_URL}/ride-request?page=${page}&start_lat=${start_lat}&start_lng=${start_lng}&end_lat=${end_lat}&end_lng=${end_lng}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



export const getRidesByDriver = (page: number) => {
    return axios.get(`${BASE_URL}/ride-request/driver?page=${page}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



export const getRidesByPassenger = (page: number) => {
    return axios.get(`${BASE_URL}/ride-request/passenger?page=${page}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const getSig = (url: string) => {
    return axios.get(`${BASE_URL}/moonpay/sign-url?url=${url}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const getBalance = () => {
    return axios.get(`${BASE_URL}/user/balance`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const bookRide = (id: string, data: any) => {
    return axios.patch(`${BASE_URL}/ride-request/book/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const getRideDetails = (id: string) => {
    return axios.get(`${BASE_URL}/ride-request/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



export const updateUser = (data: any) => {
    return axios.patch(`${BASE_URL}/user`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateDriverLocation = (id: string, data: any) => {
    return axios.patch(`${BASE_URL}/ride-request/location/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const updateStatusDriver = (id: string, data: any) => {
    return axios.patch(`${BASE_URL}/ride-request/status/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export const updateStatusPassenger = (id: string, data: any) => {
    return axios.patch(`${BASE_URL}/ride-request/status/passenger/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}



export const getRyd = (id: string) => {
    return axios.get(`${BASE_URL}/ride-request/credits/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export const getUnclaimedRides = () => {
    return axios.get(`${BASE_URL}/ride-request/driver/unclaimed`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}


export const claimRyd = (id: string, wallet: string) => {
    return axios.patch(`${BASE_URL}/ride-request/collect-credits/${id}`, { walletAddress: wallet }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const claimFare = (id: string, wallet: string) => {
    return axios.patch(`${BASE_URL}/ride-request/collect-fare/${id}`, { walletAddress: wallet }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}