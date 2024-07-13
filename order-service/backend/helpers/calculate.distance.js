const coordinatesRestaurantEnums = require('../enums/coordinates.restaurant')

const calculateDistance = (lat1, lon1) => {
    const lat2 = coordinatesRestaurantEnums.latitude
    const lon2 = coordinatesRestaurantEnums.longitude
    //haversine fomula
    const R = 6371.0; // Bán kính trái đất (km)
    const toRadians = (degree) => degree * (Math.PI / 180);
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
}

module.exports = calculateDistance