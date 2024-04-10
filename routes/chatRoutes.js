const express = require('express');
const router = express.Router();
const chats = require("../controllers/chat")

router.get('/customer/seller', chats.renderCustomerChatInterface)

router.get('/customer/seller/:sellerId/:customerId', chats.renderCustomerChat)

router.get('/seller/:sellerId', chats.renderSellerChatInterface);

router.get('/seller/:sellerId/:customerId', chats.renderSellerChat)

module.exports = router