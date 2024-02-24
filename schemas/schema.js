const Joi = require('joi')


///PRODUCT ERROR HANDLERS START
module.exports.productSchema = Joi.object({
    product: Joi.object({
        name:Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        rating: Joi.number(),
        category: Joi.string().required(),
        imageUrl: Joi.array().required(),
        reviews: Joi.array()
    })
})

/// PRODUCT ERROR HANDLERS END

/// REVIEW ERROR HANDLERS START
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    })

});

/// REVIEW ERROR HANDLERS END