const Chat = require('../models/chat')
const Seller = require('../models/seller');
const catchAsync = require('../utils/catchasync');
const Customer = require('../models/customer')

module.exports.renderCustomerChatInterface = catchAsync(async (req, res) => {
    const customerId = req.user._id;
    const chats = await Chat.find({ customer: customerId }).populate('seller').populate('customer')
    res.render('../views/customer/chatFace', { chats, customerId })
})


module.exports.renderCustomerChat = catchAsync (async (req, res) => {
    const { sellerId } = req.params;
    const customerId = req.user._id
    const seller = await Seller.findById(sellerId);
    const customer = await Customer.findById(req.user._id)
    let chat = await Chat.findOne({ seller: seller, customer: customerId })
    if (!chat) {
        chat = new Chat({
            seller: sellerId,
            customer: customerId,
            messages: []
        });
    }
    res.render('../views/customer/chat', { chat, seller, customerId, customer })
})


module.exports.renderSellerChatInterface = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id);
    const chats = await Chat.find({ seller: seller }).populate('customer').populate('seller');
    res.render('../views/seller/chatFace', { seller, chats })
})


module.exports.renderSellerChat = catchAsync(async (req, res) => {
    const { customerId } = req.params;
    const seller = await Seller.findById(req.user._id);
    const customer = await Customer.findById(customerId);
    let chat = await Chat.findOne({ seller: seller, customer: customerId })
    if (!chat) {
        chat = new Chat({
            seller: seller.id,
            customer: customerId,
            messages: [] 
        });
    }
    res.render('../views/seller/chat', { chat, seller, customerId, customer })
})
