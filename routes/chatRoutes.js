const express = require('express');
const router = express.Router();
const chats = require("../controllers/chat")

router.get('/customer', chats.renderCustomerChatInterface)

router.get('/seller', chats.renderSellerChatInterface);

router.get('/customer/:sellerId', chats.renderCustomerChat)

router.get('/seller/:customerId', chats.renderSellerChat)

module.exports = router