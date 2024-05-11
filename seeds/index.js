const mongoose = require('mongoose');
// const cities = require ('cities')
mongoose.connect('mongodb://127.0.0.1:27017/zen26');
const Product = require('../models/product.js');
const { features, types } = require('./productNames.js');
const categories = ['Computers', 'Mobiles', 'Cameras', 'Men"s', 'Women"s', 'Kids', 'Accessories', 'Decor', 'Kitchen', 'Bedding', 'Skincare', 'Haircare', 'Perfumes', 'Books', 'Movies', 'Music', 'Equipment', 'Activewear', 'Camping', 'Kids Toys', 'Board Games', 'Video Games', 'Medicines', 'Fitness Equipment', 'Monitoring Devices', 'Car Accessories', 'Maintenance', 'Motorcycle Gear', 'Ornaments', 'Stationery', 'Furniture', 'Electronics', 'Groceries', ' Snacks', 'Beverages', 'Pet Food', 'Care products', 'Handmade'];
const db = mongoose.connection;
const Seller = require('../models/seller.js')


db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

function getRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
}

// Example usage:
const startDate = '2018-01-01'; // Start date for the range
const endDate = '2024-03-17';   // End date for the range


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    const seller =  await Seller.findById('663f70522777df6b0f2b624d')
    await Product.deleteMany({});
    for (let i = 1; i <= 2000; i++) {
        const randomLaunchDate = getRandomDate(startDate, endDate);
        const productName = `${sample(features)} ${sample(types)}`;
        const sanitizedProductName = productName.replace(/[^\w\s]/g, '');
        const searchName1 = sanitizedProductName.toLowerCase().split(' ');
        const searchName2 = searchName1.join(''); // Join without any separator
        const price = Math.floor(Math.random() * 10000);
        const category = sample(categories);
        const product = new Product({
            name: productName,
            searchTerm: searchName2, // Storing search terms as a string
            imageUrl: ['https://source.unsplash.com/collection/483251', 'https://source.unsplash.com/collection/483251', 'https://source.unsplash.com/collection/483251', 'https://source.unsplash.com/collection/483251'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            price: price,
            category: category,
            rating: 0,
            brand: 'Zen Recommends',
            headers: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            launchDate: randomLaunchDate,
            seller: '663f70522777df6b0f2b624d'
        });
        await product.save();
        await seller.products.push(product)
        await seller.save();
        console.log(`${i} product saved`)
    }
};


seedDb().then(() => {
    mongoose.connection.close();
});



