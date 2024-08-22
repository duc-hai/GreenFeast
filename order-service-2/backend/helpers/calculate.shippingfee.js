const calculateShippingFee = distance => {
    const baseFee = 15000 // Base Fee for first 3 km 
    const additionalFeePerKm = 5000 // Fee for next km
    const initialDistance = 3 // Distance was calculate fee (another baseFee)

    if (distance <= initialDistance) return baseFee
    const additionalDistance = distance - initialDistance
    const additionalFee = additionalDistance.toFixed(1) * additionalFeePerKm
    return baseFee + additionalFee
}

module.exports = calculateShippingFee