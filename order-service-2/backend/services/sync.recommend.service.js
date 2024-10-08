const Menu = require('../models/menu')
const SelectSyncRecommend = require('../enums/select.sync.recommend')
const axios = require('axios')
const { Parser } = require('json2csv')
const fs = require('fs')
const promises = require('fs').promises
const path = require('path')
const Review = require('../models/review')
const FormData = require('form-data')

class SyncRecommendService {
    mainSyncRecommend = async (req, res, next) => {
        try {
            const menus = await this.exportMenuData()
            const users = await this.getUserList()
            const reviews = await this.getReviewOrder()
            await this.sendJsonAndCSV(menus, users, reviews)

            return res.send({
                menus,
                users,
            })
        }
        catch (error) {
            console.error(`Error at mainSyncRecommend: ${error.message}`)
        }
    }

    sendJsonAndCSV = async (menus, users, reviews) => {
        try {
            const formData = new FormData()
            formData.append('users', fs.createReadStream(users))
            formData.append('reviews', fs.createReadStream(reviews))
            formData.append('menus', fs.createReadStream(menus))
            const pathRecommendService = `${process.env.RECOMMEND_SERVICE_URL}/retrain`
            await axios.post(pathRecommendService, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            })
        }
        
        catch (error) {
            console.error(`Error at sendJsonAndCSV: ${error.message || error.response?.data || error.request}`)
        }
    }

    getReviewOrder = async () => {
        try {
            const reviews = await Review.find().lean()
            const resultData = reviews.reduce((newResult, value) => {
                newResult = [
                    ...newResult,
                    ...(value.reviews.reduce((result, element) => {
                        result.push({
                            user: element.user_id,
                            item: value.menu_id,
                            rating: element.rating,
                            timestamp: Math.floor(new Date(element.timestamp).getTime() / 1000)
                        })
                        return result
                    }, []))    
                ]
                return newResult
            }, [])

            const json2csvParser = new Parser()
            const csv = json2csvParser.parse(resultData)
            const pathCSV = path.join(__dirname, '../resources/reviews_dataset.csv')
            fs.writeFileSync(pathCSV, csv)

            return pathCSV
        }
        catch (error) {
            console.error(`Error at getReviewOrder: ${error.message}`)
        }
    }

    getUserList = async () => {
        const apiGatewayURL = process.env.API_GATEWAY_URL || ''
        try {
            const users = await axios({
                method: 'post',
                url: `${apiGatewayURL}/api/user-list`,
                data: {
                    token: process.env.TOKEN_USER_LIST
                }
            })
            const json2csvParser = new Parser()
            const csv = json2csvParser.parse(users.data || null)
            const pathCSV = path.join(__dirname, '../resources/data_user.csv')
            fs.writeFileSync(pathCSV, csv)
            return pathCSV
        }
        catch (error) {
            console.error(`Error at getUserList: ${error.message}`)
        }
    }

    exportMenuData = async () => {
        try {
            const menus = await Menu.find().select(SelectSyncRecommend.menu).lean()
            const jsonData = JSON.stringify(menus, null, 2)
            const pathJson = path.join(__dirname, '../resources/data_item.json')
            await promises.writeFile(pathJson, jsonData)
            return pathJson
        }
        catch (error) {
            console.error(`Error at exportMenuData: ${error.message}`)
        }
    }
}

module.exports = new SyncRecommendService()