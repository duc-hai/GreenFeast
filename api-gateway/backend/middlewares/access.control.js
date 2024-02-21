const AccessControl = require('accesscontrol')
const Role = require('../models/role')

function grantAcess (action, resource) {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user?.role)
                return next([400, 'error', 'Vui lòng kiểm tra trạng thái đăng nhập'])

            const roleName = req.user.role

            const roles = await Role.findOne({ name: roleName })
            
            if (!roles)
                return next([400, 'error', 'Không tìm thấy vai trò người dùng'])

            let grantList = []
            
            //Convert for the right format of grantList in accesscontrol npm
            for (let value of roles.grants) {
                for (let val of value.actions) {
                    grantList.push({
                        role: roleName,
                        resource: value.resource,
                        action: val
                    })
                }
            }
            
            const ac = new AccessControl(grantList)

            const permission = await ac.can(roleName)[action](resource) //it's mean ac.can('admin').readAny('menu')

            if (!permission.granted) 
                return next([400, 'error', 'Bạn không có quyền truy cập chức năng này'])

            next()
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

module.exports = {
    grantAcess
}