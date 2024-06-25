///DECLARATIONS

const Chat = require('../models/chat')
const Seller = require('../models/seller');
const catchAsync = require('../utils/catchasync');
const Customer = require('../models/customer')

/// CUSTOMER CHAT INTERFACE AND CHAT RENDER

module.exports.renderCustomerChatInterface = catchAsync(async (req, res) => {
    const customerId = req.user._id;
    const chats = await Chat.find({ customer: customerId }).populate('seller').populate('customer')
    res.render('../views/customer/interface', { chats, customerId })
})

module.exports.renderCustomerChat = catchAsync (async (req, res) => {
    const { sellerId } = req.params;
    const customerId = req.user._id
    const seller = await Seller.findById(sellerId);
    const customer = await Customer.findById(req.user._id)
    let chat = await Chat.findOne({ seller: sellerId, customer: customerId })
    if (!chat) {
        console.log('chat is not found so i am creating')
        chat = new Chat({
            seller: sellerId,
            customer: customerId,
            messages: []
        });
        chat.save();
    }else{
        console.log('chat is available')
    }
    res.render('../views/customer/chat', { chat, seller, customerId, customer })
})


/// SELLER CHAT INTERFACE AND CHAT RENDER

module.exports.renderSellerChatInterface = catchAsync(async (req, res) => {
    const seller = await Seller.findById(req.user._id);
    const chats = await Chat.find({ seller: seller }).populate('seller').populate('customer');
    res.render('../views/seller/sellerInterface', { seller, chats })
    // res.send(chats)
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
