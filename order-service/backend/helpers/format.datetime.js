const formatDateTime = dateTime => {
    try {
        const day = dateTime.getDate()
        const month = dateTime.getMonth() + 1
        const year = dateTime.getFullYear()

        const hours = dateTime.getHours()
        const minutes = dateTime.getMinutes()
        const seconds = dateTime.getSeconds()

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }
    catch (err) {
        console.error(`Error occured: ${err.message}`)
    }
}

module.exports = formatDateTime