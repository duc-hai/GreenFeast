module.exports = phoneNumber => {
    const phoneRegex = /^(?:\+84|0)(?:\d{9})$/
    return phoneRegex.test(phoneNumber)
}