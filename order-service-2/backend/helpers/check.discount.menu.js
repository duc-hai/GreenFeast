module.exports = (price, discount, startDate, endDate) => {
    const currentDate = new Date()
    const startDateType = new Date(startDate)
    const endDateType = new Date(endDate)

    return currentDate >= startDateType && currentDate <= endDateType ? discount : price
}