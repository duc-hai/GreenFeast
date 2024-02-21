const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
    res.status(200).json({test: 'test'})
})

module.exports = router