const express = require('express')
const router = express.Router()
const accountSerice = require('../services/AccountService')
const validation = require('../middlewares/validation')

router.post('/auth/signin', validation.validatorLogin(), accountSerice.loginAccount)

router.use('/', (req, res) => {
    res.status(404).json({status: 'error', message: 'url not found'})
})

module.exports = router