const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')
const axios = require('axios')
const VietNamAddressAPIEnums = require('../enums/vietnam.address.api')
const calculateDistance = require('../helpers/calculate.distance')
const calculateShippingFee = require('../helpers/calculate.shippingfee')

class AddressService {
    getProvinces = async (req, res, next) => {
        try {
            const response = await axios.get(VietNamAddressAPIEnums.province) 
            let data = response.data
            if (data.error != 0) 
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi với API'))

            const resultData = this.convertData(data.data)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy dữ liệu tỉnh thành thành công',
                data: resultData
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    convertData = data => {
        return data.map(element => {
            return {
                id: element.id,
                name: element.full_name,
                latitude: element.latitude,
                longitude: element.longitude
            }
        })
    }

    getDistricts = async (req, res, next) => {
        try {
            const provinceId = req.params.id 
            if (!provinceId)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu dữ liệu tỉnh thành'))
            const response = await axios.get(`${VietNamAddressAPIEnums.district}/${provinceId}.htm`) 
            let data = response.data
            if (data.error != 0) 
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi với API'))

            const resultData = this.convertData(data.data)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy dữ liệu quận huyện thành công',
                data: resultData
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getWards = async (req, res, next) => {
        try {
            const districtId = req.params.id 
            if (!districtId)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu dữ liệu quận huyện'))
            const response = await axios.get(`${VietNamAddressAPIEnums.ward}/${districtId}.htm`) 
            let data = response.data
            if (data.error != 0) 
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi với API'))

            const resultData = this.convertData(data.data)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy dữ liệu phường xã thành công',
                data: resultData
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    calculateShippingFee = async (req, res, next) => {
        try {
            const { longitude, latitude } = req.body
            if (!longitude || !latitude)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu dữ liệu tọa độ'))

            const distance = calculateDistance(latitude, longitude)
            const MAXIMUM_DISTANCE = process.env.MAXIMUM_DISTANCE || 20
            if (distance > MAXIMUM_DISTANCE)
                return next(createError(StatusCode.BadRequest_400, `Khoảng cách hiện tại cách nhà hàng ${distance} km, chúng tôi chỉ nhận giao hàng trong phạm vi ${MAXIMUM_DISTANCE} km`))

            const shippingFee = calculateShippingFee(distance)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Tính dữ liệu phí ship thành công',
                data: {
                    distance: `${distance} km`,
                    shippingFee: shippingFee
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new AddressService()