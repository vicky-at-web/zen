const mongoose = require('mongoose');
// const cities = require ('cities')
mongoose.connect('mongodb://127.0.0.1:27017/zen26');
const Product = require('../models/product.js');
const { features, types } = require('./productNames.js');
const categories = ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Vitamins', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'Maintenance', 'Motorcycle Gear', 'Rings', 'Watches', 'Necklaces', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Accessories', 'Care products', 'Handmade', 'Customized']
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Product.deleteMany({});
    for (let i = 0; i <= 50; i++) {
        for(let category of categories){
        const price = Math.floor(Math.random() * 10000);
        const product = new Product({
            name: `${sample(features)} ${sample(types)}`,
            imageUrl: ['https://source.unsplash.com/collection/483251','https://source.unsplash.com/collection/483251','https://source.unsplash.com/collection/483251','https://source.unsplash.com/collection/483251',],
            description: 'Lorem ispum dolor sir amet consectetr apidi skdhfkhd ahdhfhd  ahaha  dhehe agdbckeb dhdhd a fheifbe ',
            price: `${price}`,
            category: `${category}`,
            rating: 0,
            seller: '65d9bb44dd244049d8901961'
            
        });
        await product.save();
    }

}}

seedDb().then(() => {
    mongoose.connection.close();
});