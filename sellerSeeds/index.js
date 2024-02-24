const mongoose = require('mongoose');
// const cities = require ('cities')
mongoose.connect('mongodb://127.0.0.1:27017/zen26');
const Seller = require('../models/seller.js');
const { sellerFirstNames, sellerLastNames } = require('./sellerNames.js');
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Seller.deleteMany({});
    for (let i = 0; i <= 15; i++) {
       
        const price = Math.floor(Math.random() * 10000000000);
        const seller = new Seller({
            username: username,
            bussinessName: `${sample(sellerFirstNames)} ${sample(sellerLastNames)}`,
            imageUrl: 'https://source.unsplash.com/collection/483251',
            address: 'Lorem ispum dolor sir amet consectetr apidi skdhfkhd ahdhfhd  ahaha  dhehe agdbckeb dhdhd a fheifbe ',
            contact: `${price}`,
            rating: 0,
            email: `${sample(sellerFirstNames)}${sample(sellerLastNames)}@gmail.com`
        });
        await seller.save();
    }

}

seedDb().then(() => {
    mongoose.connection.close();
});