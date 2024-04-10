const express = require('express');
const router = express.Router();
const sellers = require('../controllers/sellers')

router.get('/all/sellers', sellers.allSellers)

router.get('/:id', sellers.showSeller)

router.route('/:id/product/new')
    .get(sellers.renderNewProductForm)
    .post(sellers.addProduct)

module.exports = router