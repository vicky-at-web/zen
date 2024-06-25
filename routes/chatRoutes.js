const express = require('express');
const router = express.Router();
const chats = require("../controllers/chat")

/// RENDER CHAT INTERFACE AND CHAT FOR CUSTOMERS

router.get('/customer', chats.renderCustomerChatInterface)
router.get('/customer/:sellerId', chats.renderCustomerChat)


/// RENDER CHAT INTERFACE AND CHAT FOR SELLERS

router.get('/seller', chats.renderSellerChatInterface);
router.get('/seller/:customerId', chats.renderSellerChat)

module.exports = router