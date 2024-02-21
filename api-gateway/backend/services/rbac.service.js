const Account = require('../models/account')
const User = require('../models/user')
const AccessControl = require('accesscontrol')

class RBACService {
    async rbacTest (req, res, next) {
        try {
            let grantList = [
                { role: 'admin', resource: 'menu', action: 'create:any', attributes: '*, !views' },
                { role: 'client', resource: 'menu32', action: 'create:any', attributes: '*, !views' },
            ];
            const ac = new AccessControl(grantList);

            const permission = ac.can(req.query.role)['create']('menu');

            console.log(permission)

            if (!permission.granted) {
                return res.status(401).json({
                  error: 'You are not authorized to perform this action'
                });
              }
            else 
                return res.status(200).json({test: 'test'})
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async finalPoint(req, res, next) {
        try {

        }
        catch (err) {
            res.status(400).json({error: err.message})
        }
    }
}

module.exports = new RBACService()
