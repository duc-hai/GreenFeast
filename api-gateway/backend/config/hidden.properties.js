const baseHiddenProperties = {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
    customer: 0
}

module.exports = {
    userInfor: {
        ...baseHiddenProperties,
        status: 0,
        user_type: 0,
    },
    employeesList: {
        ...baseHiddenProperties,
        employee: 0,
        password: 0,
        salt: 0,
        role: 0,
        status: 0,
        user_type: 0
    }
}