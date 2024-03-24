const express = require('express');
const router = express.Router();
const Seller = require('../models/seller')
const Product = require('../models/product')
const catchAsync = require('../utils/catchasync');
const passport = require('passport');
const Chat = require('../models/chat')
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();



router.get('/all/sellers', catchAsync(async (req, res) => {
    const sellers = await Seller.find({})
    res.render('../views/seller/index.ejs', { sellers })
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate('products');
    res.render('../views/seller/custsell', { seller })
}))

router.get('/:id/product/new', catchAsync(async (req, res) => {
    const {id} = req.params;
    const seller = await Seller.findById(id)
    res.render('../views/seller/addProduct', {seller})
}))

router.post('/:id/product/new', catchAsync(async(req, res) =>{
    const {id} = req.params;
    const seller = await Seller.findById(id);
    const product = new Product(req.body.product);
    seller.products.push(product);
    await product.save();
    await seller.save();
    console.log(seller)
    res.redirect(`/seller/${id}`)
}))

router.get('/chat/seller/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        const customerId = '65f6e6d6e3fa623dc7011168';
        const product = await Product.findById('65f6c8ea754805b81685ef4d');
        const seller = await Seller.findById(sellerId);
        let chat = await Chat.findOne({ seller: sellerId, customer: customerId });
        if (!chat) {
            chat = new Chat({
                seller: sellerId,
                customer: customerId,
                messages: [] // Initialize messages array
            });
            await chat.save(); // Save the newly created chat
        }
        // Assuming you want to mark all existing messages as read when fetching chat
        chat.messages.forEach(message => {
            message.isRead = true;
        });

        // Render the seller chat page
        res.render('../views/seller/chat', { seller, chat, product });

        // Set up SSE listener for this route
        const messageListener = (message) => {
            // Send SSE event to client
            res.write(`data: ${JSON.stringify(message)}\n\n`);
        };
        eventEmitter.on('message', messageListener);

        // Remove event listener when client disconnects
        req.on('close', () => {
            eventEmitter.off('message', messageListener);
        });
    } catch (error) {
        console.error('Error rendering seller chat page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle sending messages from customer to seller
router.post('/chat/:id/customer/:sellerId', async (req, res) => {
    try {
        const { sellerId, id } = req.params;
        const customerId = '65f6e6d6e3fa623dc7011168';
        const seller = await Seller.findById(sellerId);
        let chat = await Chat.findOne({ seller: sellerId, customer: customerId });
        const messageContent = req.body.content;
        if (!chat) {
            chat = new Chat({
                seller: sellerId,
                customer: customerId,
                messages: [] // Initialize messages array
            });
        }
        chat.messages.push({
            content: messageContent,
            sender: seller.role,
            timestamp: new Date()
        });

        // Save the updated chat document
        await chat.save();

        // Emit SSE event for message
        eventEmitter.emit('message', { content: messageContent });

        console.log('Message added to the chat successfully');
        res.redirect(`/seller/chat/seller/${sellerId}`);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router