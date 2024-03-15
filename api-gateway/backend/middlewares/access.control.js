const AccessControl = require('accesscontrol')
const Role = require('../models/role')

// use rbac architecture to control access 
function grantAccess (action, resource) {
    return async (req, res, next) => {
        try {
            //Get user infor from req. req will be passed through a middleware to assign the user's value from the cookie (access token jwt) to req.user
            if (!req.user || !req.user?.role || req.user?.user_type != 1)
                return next([400, 'error', 'Vui lòng kiểm tra trạng thái đăng nhập'])

            const roleName = req.user.role

            //Get role name & Convert for the right format of grantList in accesscontrol npm
            let grantList = await getRoleAndformatGrantList(roleName)

            const ac = new AccessControl(grantList)

            //Inherit role
            //admin & cashier extends waitstaff
            const allRoles = await Role.find()
            
            const roleArray = allRoles.map(value => value.name) //Get array of role name

            if (roleArray.includes(roleName) && roleArray.some(value => value === 'waitstaff')) { //Just build inherit in case role name of current user in database & role name is waitstaff (because admin & cashier extends waitstaff, we need waitstaff first)
                let grantListArray = []
                for (let element of ['waitstaff', 'admin', 'cashier']) {
                    if (element !== roleName) {
                        const grantList = await getRoleAndformatGrantList(element)
                        grantListArray.push(grantList)
                    }
                }
             
                for (let element of grantListArray) {
                    grantList = grantList.concat(element)
                }   

                ac.setGrants(grantList) //Override to set new grant list

                //Inherit role
                if (roleArray.includes('admin')) 
                    ac.grant('admin').extend('waitstaff')
                if (roleArray.includes('cashier'))
                    ac.grant('cashier').extend('waitstaff')
            }
                
            const permission = await ac.can(roleName)[action](resource) //it's mean ac.can('admin').readAny('menu')

            //Check permission
            if (!permission.granted) 
                return next([400, 'error', 'Bạn không có quyền truy cập chức năng này'])

            return next()
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

async function getRoleAndformatGrantList (roleName) {
    try {
        const role = await Role.findOne({ name: roleName })
            
        if (!role)
            return next([400, 'error', 'Không tìm thấy vai trò người dùng'])

        let grantList = []

        for (let value of role.grants) {
            for (let val of value.actions) {
                grantList.push({
                    role: roleName,
                    resource: value.resource,
                    action: val
                })
            }
        }
        
        return grantList
    }
    catch (err) {
        throw new Error([400, 'error', err.message])
        //return next([400, 'error', err.message])
    }
}

module.exports = {
    grantAccess
}