const AccessControl = require('accesscontrol')
const Role = require('../models/role')
const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')

// use rbac architecture to control access 
function grantAccess (action, resource) {
    return async (req, res, next) => {
        try {
            //Get user infor from req. req will be passed through a middleware to assign the user's value from the cookie (access token jwt) to req.user
            if (!req.user || !req.user?.role || req.user?.user_type != 1)
                return next(createError(StatusCode.BadRequest_400, 'Vui lòng kiểm tra trạng thái đăng nhập'))

            const roleName = req.user.role

            //Get role name & Convert for the right format of grantList in accesscontrol npm
            let grantList = await getRoleAndformatGrantList(roleName)

            const ac = new AccessControl(grantList)

            //Inherit role: admin extends waitstaff
            if (roleName === 'admin') {
                const grantOfWaitstaff = await getRoleAndformatGrantList('waitstaff') //get all grant of waitstaff and add them to gran list (because of must have data to inherit)

                for (let element of grantOfWaitstaff) {
                    grantList = grantList.concat(element)
                }   

                ac.setGrants(grantList) //Override to set new grant list
                ac.grant('admin').extend('waitstaff')
            }
            
                
            const permission = await ac.can(roleName)[action](resource) //it's mean ac.can('admin').readAny('menu')

            //Check permission
            if (!permission.granted) 
                return next(createError(StatusCode.BadRequest_400, 'Bạn không có quyền truy cập chức năng này'))

            return next()
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message))
        }
    }
}

/*
    Format data of grant is suitable with data on accesscontrol npm docs

    Sample: 
    let grantList = [
        { role: 'admin', resource: 'video', action: 'create:any'},
        { role: 'admin', resource: 'video', action: 'read:any'},
        { role: 'admin', resource: 'video', action: 'update:any'},
        { role: 'admin', resource: 'video', action: 'delete:any'},
    
        { role: 'user', resource: 'video', action: 'create:own'},
        { role: 'user', resource: 'video', action: 'read:any'},
        { role: 'user', resource: 'video', action: 'update:own'},
        { role: 'user', resource: 'video', action: 'delete:own'}
    ]
*/
async function getRoleAndformatGrantList (roleName) {
    try {
        const role = await Role.findOne({ name: roleName })

        if (!role)
            return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy vai trò người dùng'))

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
        return next(createError(StatusCode.InternalServerError_500, err.message))
    }
}

module.exports = {
    grantAccess
}