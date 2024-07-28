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
                this.updateRatingMenu(menuId, rating)
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
                this.updateRatingMenu(menuId, rating)
            }
            return
        }
        catch (err) {
            console.error(err.message)
        }
    }

    updateRatingMenu = async (menuId, rating) => {
        try {
            const menu = await Menu.findOne({ _id: menuId })
            menu.rating_sum += rating
            menu.rating_count += 1
            menu.rating_average = (menu.rating_sum / menu.rating_count).toFixed(1)

            await menu.save()
        }
        catch (err) {
            console.error(err.message)
        }
    }
}

module.exports = new RatingService()