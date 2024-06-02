import axios from "axios";

const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

const GeocodingService = {
    getCoordinates: async (address) => {
        try {
            const response = await axios.get(GEOCODING_API_URL, {
                params: {
                    address: address,
                    key: process.env.REACT_APP_GEOCODING_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            throw error;
        }
    }
};

export default GeocodingService;
