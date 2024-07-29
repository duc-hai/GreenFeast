const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')
const checkValidation = require('../helpers/check.validation')
const Menu = require('../models/menu')
const Order = require('../models/order')
const OrderOnline = require('../models/online_order')
const Review = require('../models/review')

class RatingService {
    ratingMenu = async (req, res, next) => {
        try {
            const { orderId, order } = req.body

            if (!order || !orderId || !Array.isArray(order)) return next(createError(StatusCode.BadRequest_400, 'Thiếu dữ liệu để đánh giá')) 

            const user = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))
            if (!user) return next(createError(StatusCode.BadRequest_400, 'Không thể lấy được dữ liệu người dùng')) 

            if (checkValidation(req) !== null) return next(createError(StatusCode.BadRequest_400, checkValidation(req))) 

            const orderDb = await Order.findOne({ _id: orderId, status: true, is_rating: false })
            const orderOnlineDb = await OrderOnline.findOne({ _id: orderId, status: 5, is_rating: false }) //status 5 is delivered //check right menu
    
            if (!orderDb && !orderOnlineDb) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy đơn hàng hoặc đơn hàng chưa hoàn thành hoặc đơn hàng đã đánh giá')) 
    
            if (orderDb) {
                    //check
                    orderDb.is_rating = true
                    await orderDb.save()
            }
            else {
                if (orderOnlineDb.order_person?._id !== user._id) {
                    return next(createError(StatusCode.BadRequest_400, 'Tài khoản đánh giá không hợp lệ')) 
                }
                orderOnlineDb.is_rating = true
                await orderOnlineDb.save()
            }

            //asynchorously
            order.forEach(value => {
                this.ratingMenuDatabase(value.menuId, user, value.rating, value.comment, orderId)
            })
              
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Đánh giá món ăn thành công'
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    ratingMenuDatabase = async (menuId, user, rating, comment, orderId) => {
        try {
            const review = await Review.findOne({ menu_id: menuId }).sort({ page: -1 })

            const newReview = {
                user_id: user._id,
                user_name: user.full_name,
                order_id: orderId,
                rating: rating,
                comment: comment || ''
            }

            if (!review) {
                await new Review ({
                    menu_id: menuId,
                    page: 1,
                    reviews: [
                        newReview
                    ]
                }).save()
                this.updateRatingMenu(menuId, rating, 1)
                return 
            }

            // Add menu into available page
            if (review.count < 10) {
                review.count = review.count + 1
                review.reviews.push(newReview)
                await review.save()  
                this.updateRatingMenu(menuId, rating)
            }
            //Create the new next page
            else {
                await new Review ({
                    menu_id: menuId,
                    page: review.page + 1,
                    reviews: [
                        newReview
                    ]
                }).save()
                this.updateRatingMenu(menuId, rating, 1)
            }
            return
        }
        catch (err) {
            console.error(err.message)
        }
    }

    updateRatingMenu = async (menuId, rating, addPage = 0) => {
        try {
            const menu = await Menu.findOne({ _id: menuId })
            menu.rating_sum += rating
            menu.rating_count += 1
            menu.rating_average = (menu.rating_sum / menu.rating_count).toFixed(1)
            menu.rating_pages += addPage
            await menu.save()
        }
        catch (err) {
            console.error(err.message)
        }
    }

    viewRating = async (req, res, next) => {
        try {
            const menuId = req.params.id
            if (!menuId) return next(createError(StatusCode.BadRequest_400, 'Thiếu mã món ăn')) 
            const menu = await Menu.findOne({
                _id: menuId,
                status: true
            })
            if (!menu) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy món ăn')) 
            const totalPage = menu.rating_pages 
            let page = req.query.page || 1  
            const reviewList = await Review.findOne({
                menu_id: menuId,
                page: parseInt(totalPage - (page - 1))
            })

            let reviews = []
            if (reviewList) {
                reviews = reviewList.reviews.map(value => {
                    if (value.is_show === true)
                        return {
                            user_name: value.user_name,
                            rating: value.rating,
                            comment: value.comment,
                            timestamp: value.timestamp,
                        }
                    else return {}
                })
            }
            
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách đánh giá thành công',
                data: reviews,
                pagination: {
                    totalPage: totalPage,
                    currentPage: parseInt(page),
                    pagesize: 10,
                    nextpage: totalPage <= page ? -1 : parseInt(page) + 1,
                    prevpage: page <= 1 ? -1 : parseInt(page) - 1
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new RatingService()