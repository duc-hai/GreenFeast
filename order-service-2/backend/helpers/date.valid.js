module.exports = function (date) {
    try {
        return !isNaN(new Date(date))
    }
    catch (error) {
        console.error(`Error occured at DateValidHelper: ${error.message}`)
    }
}